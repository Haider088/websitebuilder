import { useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import * as Babel from '@babel/standalone';
import * as React from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class CustomComponentErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded bg-red-50">
          <h3 className="text-red-800 font-semibold mb-2">Component Error</h3>
          <p className="text-red-700 text-sm mb-2">{this.state.error?.message}</p>
          <details className="text-xs text-red-600">
            <summary className="cursor-pointer">Stack Trace</summary>
            <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto">
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

interface LiveComponentRendererProps {
  code: string;
  props?: Record<string, any>;
}

export function LiveComponentRenderer({ code, props = {} }: LiveComponentRendererProps) {
  const [error, setError] = useState<string | null>(null);
  const [componentError, setComponentError] = useState<Error | null>(null);

  const CompiledComponent = useMemo(() => {
    try {
      setError(null);
      setComponentError(null);
      
      const ast = Babel.transform(code, {
        presets: ['react', 'typescript'],
        plugins: [
          function() {
            return {
              visitor: {
                ImportDeclaration(path: any) {
                  path.remove();
                },
                ExportDefaultDeclaration(path: any) {
                  const declaration = path.node.declaration;
                  if (declaration) {
                    const t = (Babel as any).types || require('@babel/types');
                    let expression = declaration;
                    
                    if (t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) {
                      expression = t.toExpression(declaration);
                    }
                    
                    path.replaceWith(
                      t.variableDeclaration('const', [
                        t.variableDeclarator(
                          t.identifier('CustomComponent'),
                          expression
                        )
                      ])
                    );
                  } else {
                    path.remove();
                  }
                },
                ExportNamedDeclaration(path: any) {
                  if (path.node.declaration) {
                    path.replaceWith(path.node.declaration);
                  } else {
                    path.remove();
                  }
                }
              }
            };
          }
        ],
        filename: 'custom-component.tsx',
      });

      if (!ast.code) {
        throw new Error('Compilation produced no output');
      }

      const wrappedCode = `
        (function() {
          'use strict';
          const window = undefined;
          const document = undefined;
          const globalThis = undefined;
          const eval = undefined;
          const Function = undefined;
          ${ast.code}
          return typeof CustomComponent !== 'undefined' ? CustomComponent : null;
        })()
      `;

      const safeGlobals = {
        React,
        useState: React.useState,
        useEffect: React.useEffect,
        useRef: React.useRef,
        useMemo: React.useMemo,
        useCallback: React.useCallback,
        useContext: React.useContext,
        useReducer: React.useReducer,
        useLayoutEffect: React.useLayoutEffect,
        useImperativeHandle: React.useImperativeHandle,
        useDebugValue: React.useDebugValue,
        useDeferredValue: (React as any).useDeferredValue,
        useTransition: (React as any).useTransition,
        useId: (React as any).useId,
        useSyncExternalStore: (React as any).useSyncExternalStore,
        useInsertionEffect: (React as any).useInsertionEffect,
        forwardRef: React.forwardRef,
        memo: React.memo,
        createContext: React.createContext,
        Fragment: React.Fragment,
        Suspense: React.Suspense,
        lazy: React.lazy,
        startTransition: (React as any).startTransition,
        createElement: React.createElement,
        cloneElement: React.cloneElement,
        isValidElement: React.isValidElement,
      };

      const ComponentConstructor = new Function(
        ...Object.keys(safeGlobals),
        wrappedCode
      )(...Object.values(safeGlobals));

      if (!ComponentConstructor) {
        throw new Error('Component was not exported correctly. Make sure to define "CustomComponent"');
      }

      return ComponentConstructor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Custom component compilation error:', err);
      return null;
    }
  }, [code]);

  const handleComponentError = (error: Error, errorInfo: ErrorInfo) => {
    setComponentError(error);
    console.error('Custom component runtime error:', error, errorInfo);
  };

  if (error) {
    return (
      <div className="p-4 border border-orange-500 rounded bg-orange-50">
        <h3 className="text-orange-800 font-semibold mb-2">Compilation Error</h3>
        <p className="text-orange-700 text-sm mb-2">{error}</p>
        <details className="text-xs text-orange-600">
          <summary className="cursor-pointer">Component Code</summary>
          <pre className="mt-2 p-2 bg-orange-100 rounded overflow-auto">
            {code}
          </pre>
        </details>
      </div>
    );
  }

  if (!CompiledComponent) {
    return (
      <div className="p-4 border border-gray-300 rounded bg-gray-50">
        <p className="text-gray-600 text-sm">No component to render</p>
      </div>
    );
  }

  return (
    <CustomComponentErrorBoundary 
      key={code}
      onError={handleComponentError}
    >
      <CompiledComponent {...props} />
    </CustomComponentErrorBoundary>
  );
}
