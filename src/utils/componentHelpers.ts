import { CanvasComponent } from '../types';

/**
 * Recursively find a component by ID in a component tree
 */
export function findComponentById(
  components: CanvasComponent[],
  id: string
): CanvasComponent | null {
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children && component.children.length > 0) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Recursively update a component by ID in a component tree
 */
export function updateComponentById(
  components: CanvasComponent[],
  id: string,
  updates: Partial<CanvasComponent>
): CanvasComponent[] {
  return components.map((component) => {
    if (component.id === id) {
      return { ...component, ...updates };
    }
    if (component.children && component.children.length > 0) {
      return {
        ...component,
        children: updateComponentById(component.children, id, updates),
      };
    }
    return component;
  });
}

/**
 * Recursively delete a component by ID from a component tree
 */
export function deleteComponentById(
  components: CanvasComponent[],
  id: string
): CanvasComponent[] {
  return components
    .filter((component) => component.id !== id)
    .map((component) => {
      if (component.children && component.children.length > 0) {
        return {
          ...component,
          children: deleteComponentById(component.children, id),
        };
      }
      return component;
    });
}

/**
 * Recursively delete multiple components by IDs from a component tree
 */
export function deleteComponentsByIds(
  components: CanvasComponent[],
  ids: string[]
): CanvasComponent[] {
  return components
    .filter((component) => !ids.includes(component.id))
    .map((component) => {
      if (component.children && component.children.length > 0) {
        return {
          ...component,
          children: deleteComponentsByIds(component.children, ids),
        };
      }
      return component;
    });
}

/**
 * Flatten a component tree into a single array (for layers panel, selection, etc.)
 */
export function flattenComponents(
  components: CanvasComponent[],
  depth = 0
): Array<CanvasComponent & { depth: number }> {
  const result: Array<CanvasComponent & { depth: number }> = [];
  
  for (const component of components) {
    result.push({ ...component, depth });
    
    if (component.children && component.children.length > 0) {
      result.push(...flattenComponents(component.children, depth + 1));
    }
  }
  
  return result;
}

/**
 * Get all component IDs in a tree (useful for multi-select with containers)
 */
export function getAllComponentIds(components: CanvasComponent[]): string[] {
  const ids: string[] = [];
  
  for (const component of components) {
    ids.push(component.id);
    
    if (component.children && component.children.length > 0) {
      ids.push(...getAllComponentIds(component.children));
    }
  }
  
  return ids;
}

/**
 * Check if a component is a container type
 */
export function isContainerComponent(component: CanvasComponent): boolean {
  return (
    component.componentId === 'row-container' ||
    component.componentId === 'grid-container' ||
    component.componentId === 'two-column' ||
    component.componentId === 'three-column' ||
    component.componentId === 'container' ||
    component.componentId === 'group' ||
    component.props?.isContainer === true ||
    component.props?.acceptsChildren === true
  );
}

/**
 * Get the parent component of a given component ID
 */
export function findParentComponent(
  components: CanvasComponent[],
  childId: string
): CanvasComponent | null {
  for (const component of components) {
    if (component.children && component.children.some((child) => child.id === childId)) {
      return component;
    }
    
    if (component.children && component.children.length > 0) {
      const found = findParentComponent(component.children, childId);
      if (found) return found;
    }
  }
  
  return null;
}
