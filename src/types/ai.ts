import { CanvasComponent, GlobalSettings } from './index';

export type AIActionType = 
  | 'use-component'        // Add existing component from library
  | 'modify-component'     // Update existing component props
  | 'create-component'     // Create custom component
  | 'create-multiple'      // Create multiple components at once
  | 'system-operation'     // Update global settings, CSS, etc.
  | 'batch-operation'      // Batch update/delete/modify
  | 'explanation';         // Just explain, no action

export type AIRiskLevel = 'safe' | 'moderate' | 'risky';

export interface AIAction {
  type: AIActionType;
  riskLevel: AIRiskLevel;
  description: string;
  requiresApproval: boolean;
  data: AIActionData;
}

export type AIActionData =
  | UseComponentData
  | ModifyComponentData
  | CreateComponentData
  | CreateMultipleData
  | SystemOperationData
  | BatchOperationData
  | ExplanationData;

export interface UseComponentData {
  componentId: string;
  props?: Record<string, any>;
  parentId?: string;
  count?: number; // For adding multiple of the same component
}

export interface ModifyComponentData {
  componentId: string; // ID of component to modify
  updates: Partial<CanvasComponent>;
}

export interface CreateComponentData {
  code: string; // React component code
  fileName: string; // e.g., 'ParallaxHero.tsx'
  folder: 'custom' | 'layout' | 'content';
  componentId: string; // Unique ID for registration
  name: string;
  category: string;
  defaultProps: Record<string, any>;
  dependencies?: string[]; // npm packages needed
}

export interface CreateMultipleData {
  components: Array<{
    componentId: string;
    props?: Record<string, any>;
    parentId?: string;
  }>;
}

export interface SystemOperationData {
  operation: 'update-css' | 'update-global-settings' | 'optimize-assets' | 'migrate-components';
  changes: {
    css?: string;
    globalSettings?: Partial<GlobalSettings>;
    assetOptimizations?: Array<{ id: string; action: string }>;
    componentMigrations?: Array<{ from: string; to: string }>;
  };
  preview?: string; // Preview of changes
}

export interface BatchOperationData {
  operations: Array<{
    action: 'update' | 'delete' | 'move';
    componentIds: string[];
    updates?: Partial<CanvasComponent>;
  }>;
}

export interface ExplanationData {
  question: string;
  answer: string;
  suggestions?: string[];
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  actions?: AIAction[];
  isExecuting?: boolean;
  executed?: boolean;
  error?: string;
}

export interface AIContext {
  // Component library available
  componentLibrary: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    defaultProps: Record<string, any>;
  }>;
  
  // Current page state
  currentComponents: Array<{
    id: string;
    componentId: string;
    name: string;
    props: Record<string, any>;
  }>;
  
  // Global settings
  globalSettings: GlobalSettings;
  
  // Recent user actions (for context)
  recentActions: string[];
}

export interface AIResponse {
  message: string;
  actions: AIAction[];
  confidence: number; // 0-1, how confident AI is in the response
  needsClarification: boolean;
  clarificationQuestion?: string;
}
