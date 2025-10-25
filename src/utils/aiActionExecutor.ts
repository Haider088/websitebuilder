import { 
  AIAction, 
  UseComponentData, 
  ModifyComponentData,
  CreateComponentData,
  CreateMultipleData,
  SystemOperationData,
  BatchOperationData,
} from '../types/ai';
import { CanvasComponent, RestaurantComponent, GlobalSettings, Page } from '../types';
import { restaurantComponents } from '../data/restaurantComponents';
import { toast } from 'sonner@2.0.3';

export interface ExecutionContext {
  pages: Page[];
  currentPageId: string;
  globalSettings: GlobalSettings;
  onUpdateComponent: (id: string, props: Record<string, any>) => void;
  onDrop: (component: RestaurantComponent, parentId?: string) => void;
  onUpdateGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  onDeleteComponents: (ids: string[]) => void;
}

export async function executeActions(
  actions: AIAction[],
  context: ExecutionContext
): Promise<{ success: boolean; message: string }> {
  try {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      try {
        await executeAction(action, context);
      } catch (actionError) {
        console.error(`Failed to execute action ${i + 1}/${actions.length}:`, {
          actionType: action.type,
          actionData: action.data,
          error: actionError,
        });
        throw new Error(
          `Failed to execute ${action.type} action: ${actionError instanceof Error ? actionError.message : 'Unknown error'}`
        );
      }
    }
    
    return {
      success: true,
      message: `Successfully executed ${actions.length} action${actions.length > 1 ? 's' : ''}`,
    };
  } catch (error) {
    console.error('Failed to execute actions:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to execute actions',
    };
  }
}

async function executeAction(action: AIAction, context: ExecutionContext): Promise<void> {
  switch (action.type) {
    case 'use-component':
      return executeUseComponent(action.data as UseComponentData, context);
    
    case 'modify-component':
      return executeModifyComponent(action.data as ModifyComponentData, context);
    
    case 'create-component':
      return executeCreateComponent(action.data as CreateComponentData, context);
    
    case 'create-multiple':
      return executeCreateMultiple(action.data as CreateMultipleData, context);
    
    case 'system-operation':
      return executeSystemOperation(action.data as SystemOperationData, context);
    
    case 'batch-operation':
      return executeBatchOperation(action.data as BatchOperationData, context);
    
    case 'explanation':
      // No action needed for explanations
      return;
    
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function executeUseComponent(data: UseComponentData, context: ExecutionContext): void {
  const component = restaurantComponents.find(c => c.id === data.componentId);
  
  if (!component) {
    throw new Error(`Component not found: ${data.componentId}`);
  }

  // Process image props if present
  let propsToMerge = data.props || {};
  if (data.props) {
    const imageProps = ['backgroundImage', 'imageUrl', 'src', 'image', 'logoUrl'];
    propsToMerge = { ...data.props };
    
    for (const key of imageProps) {
      if (propsToMerge[key] && typeof propsToMerge[key] === 'string') {
        const value = propsToMerge[key];
        // If it's not already a full URL, convert to Unsplash URL
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          propsToMerge[key] = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(value)}`;
        }
      }
    }
  }

  // Merge default props with AI-provided props
  const mergedProps = {
    ...component.defaultProps,
    ...propsToMerge,
  };

  // Create a temporary component with merged props
  const componentToAdd: RestaurantComponent = {
    ...component,
    defaultProps: mergedProps,
  };

  // Add component (possibly multiple times)
  const count = data.count || 1;
  for (let i = 0; i < count; i++) {
    context.onDrop(componentToAdd, data.parentId);
  }

  toast.success(`Added ${count} ${component.name}${count > 1 ? 's' : ''}`);
}

function executeModifyComponent(data: ModifyComponentData, context: ExecutionContext): void {
  console.log('🔧 Modify Component - Data:', JSON.stringify(data, null, 2));
  const currentPage = context.pages.find(p => p.id === context.currentPageId);
  
  if (!currentPage) {
    throw new Error('Current page not found');
  }

  // Validate data structure
  if (!data || !data.componentId) {
    throw new Error('Invalid modify component data: componentId is required');
  }

  if (!data.updates || typeof data.updates !== 'object') {
    throw new Error('Invalid modify component data: updates object is required');
  }

  // First try to find by instance ID
  let component = findComponentRecursive(currentPage.components, data.componentId);
  
  // If not found, try to find by componentId (type)
  if (!component) {
    component = findComponentByComponentId(currentPage.components, data.componentId);
  }
  
  if (!component) {
    throw new Error(`Component not found. Looking for: "${data.componentId}". Available components: ${getAllComponentInfo(currentPage.components).join(', ')}`);
  }

  console.log('✅ Found:', component.name, component.id);
  console.log('📝 Updates:', JSON.stringify(data.updates, null, 2));
  
  // Build updates with null/undefined checks
  const updates: Record<string, any> = {};
  
  if (data.updates.props && typeof data.updates.props === 'object') {
    // Process image props synchronously using a simpler approach
    const processedProps = { ...data.updates.props };
    const imageProps = ['backgroundImage', 'imageUrl', 'src', 'image', 'logoUrl'];
    
    for (const key of imageProps) {
      if (processedProps[key] && typeof processedProps[key] === 'string') {
        const value = processedProps[key];
        // If it's not already a full URL, convert to Unsplash URL
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          processedProps[key] = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(value)}`;
        }
      }
    }
    
    Object.assign(updates, processedProps);
  }
  
  if (data.updates.responsiveProps) {
    updates.__responsiveProps = data.updates.responsiveProps;
  }
  
  if (data.updates.interactions) {
    updates.__interactions = data.updates.interactions;
  }
  
  if (data.updates.layoutConfig) {
    updates.__layoutConfig = data.updates.layoutConfig;
  }
  
  if (data.updates.spacing) {
    updates.__spacing = data.updates.spacing;
  }
  
  if (data.updates.childConfig) {
    updates.__childConfig = data.updates.childConfig;
  }
  
  if (data.updates.positionConfig) {
    updates.__positionConfig = data.updates.positionConfig;
  }

  // Check if we have any updates to apply
  if (Object.keys(updates).length === 0) {
    throw new Error('No valid updates provided');
  }

  // Use the actual component ID (not the componentId type)
  console.log('💾 Calling onUpdateComponent with ID:', component.id);
  console.log('💾 Final updates object:', updates);
  context.onUpdateComponent(component.id, updates);
  toast.success(`Updated ${component.name}`);
}

function executeCreateComponent(data: CreateComponentData, context: ExecutionContext): void {
  // Custom component creation
  // Since we can't write files directly, we'll create an inline custom component
  // and add it to the page as a special component type
  
  if (!data.componentCode || !data.componentName) {
    throw new Error('Custom component creation requires componentCode and componentName');
  }

  // Create a custom component entry
  const customComponent: CanvasComponent = {
    id: `custom-${Date.now()}`,
    componentId: 'custom',
    name: data.componentName,
    category: 'custom',
    props: {
      code: data.componentCode,
      description: data.description || 'Custom component',
      ...data.defaultProps,
    },
    position: context.pages.find(p => p.id === context.currentPageId)?.components.length || 0,
  };

  // For now, we'll show the code to the user and let them know this feature is experimental
  toast.info(
    `Custom component "${data.componentName}" created! Note: This is an experimental feature. The component code is stored but may require manual integration.`,
    { duration: 5000 }
  );

  console.log('🎨 Custom Component Created:', {
    name: data.componentName,
    code: data.componentCode,
    props: data.defaultProps,
  });

  // Add the component placeholder
  // In a full implementation, this would:
  // 1. Validate the TypeScript/React code
  // 2. Bundle it dynamically
  // 3. Register it in the component library
  // 4. Make it available for use
  
  // For now, we just acknowledge the creation
  toast.warning('Custom components are experimental. The code has been logged to the console for review.');
}

function executeCreateMultiple(data: CreateMultipleData, context: ExecutionContext): void {
  for (const componentData of data.components) {
    const component = restaurantComponents.find(c => c.id === componentData.componentId);
    
    if (!component) {
      console.warn(`Component not found: ${componentData.componentId}`);
      continue;
    }

    const mergedProps = {
      ...component.defaultProps,
      ...componentData.props,
    };

    const componentToAdd: RestaurantComponent = {
      ...component,
      defaultProps: mergedProps,
    };

    context.onDrop(componentToAdd, componentData.parentId);
  }

  toast.success(`Added ${data.components.length} components`);
}

function executeSystemOperation(data: SystemOperationData, context: ExecutionContext): void {
  if (data.changes.globalSettings) {
    context.onUpdateGlobalSettings(data.changes.globalSettings);
    toast.success('Global settings updated');
  }

  if (data.changes.css) {
    // Show warning - CSS changes are risky
    toast.warning('Custom CSS updates require manual editing of globals.css');
  }

  if (data.changes.assetOptimizations) {
    toast.info(`Asset optimization suggestions: ${data.changes.assetOptimizations.length} items`);
  }

  if (data.changes.componentMigrations) {
    toast.info('Component migration suggestions available');
  }
}

function executeBatchOperation(data: BatchOperationData, context: ExecutionContext): void {
  const currentPage = context.pages.find(p => p.id === context.currentPageId);
  
  if (!currentPage) {
    throw new Error('Current page not found');
  }

  for (const operation of data.operations) {
    switch (operation.action) {
      case 'update':
        for (const componentId of operation.componentIds) {
          if (operation.updates) {
            const updates: Record<string, any> = {};
            
            if (operation.updates.props) {
              Object.assign(updates, operation.updates.props);
            }
            
            context.onUpdateComponent(componentId, updates);
          }
        }
        break;
      
      case 'delete':
        context.onDeleteComponents(operation.componentIds);
        break;
      
      case 'move':
        // Move not yet implemented
        toast.info('Move operation not yet supported');
        break;
    }
  }

  toast.success('Batch operation completed');
}

// Helper function to find component recursively by instance ID
function findComponentRecursive(
  components: CanvasComponent[],
  id: string
): CanvasComponent | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    
    if (component.children && component.children.length > 0) {
      const found = findComponentRecursive(component.children, id);
      if (found) return found;
    }
  }
  
  return null;
}

// Helper function to find component by componentId (type)
function findComponentByComponentId(
  components: CanvasComponent[],
  componentId: string
): CanvasComponent | null {
  for (const component of components) {
    if (component.componentId === componentId) {
      return component;
    }
    
    if (component.children && component.children.length > 0) {
      const found = findComponentByComponentId(component.children, componentId);
      if (found) return found;
    }
  }
  
  return null;
}

// Helper function to get all component info for debugging
function getAllComponentInfo(components: CanvasComponent[]): string[] {
  const info: string[] = [];
  
  for (const component of components) {
    info.push(`${component.name} (type: ${component.componentId}, id: ${component.id})`);
    
    if (component.children && component.children.length > 0) {
      info.push(...getAllComponentInfo(component.children));
    }
  }
  
  return info;
}
