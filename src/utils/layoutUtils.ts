import { SpacingSize, SpacingConfig, LayoutConfig, ChildConfig, PositionConfig } from '../types';

// Spacing size mappings
const SPACING_MAP: Record<SpacingSize, string> = {
  none: '0',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

// Convert spacing config to CSS styles
export function getSpacingStyles(spacing?: SpacingConfig): React.CSSProperties {
  if (!spacing) return {};

  const styles: React.CSSProperties = {};

  // Gap (for flex/grid containers)
  if (spacing.gap) {
    styles.gap = SPACING_MAP[spacing.gap];
  }

  // Margins
  if (spacing.marginTop) {
    styles.marginTop = SPACING_MAP[spacing.marginTop];
  }
  if (spacing.marginRight) {
    styles.marginRight = SPACING_MAP[spacing.marginRight];
  }
  if (spacing.marginBottom) {
    styles.marginBottom = SPACING_MAP[spacing.marginBottom];
  }
  if (spacing.marginLeft) {
    styles.marginLeft = SPACING_MAP[spacing.marginLeft];
  }

  // Paddings
  if (spacing.paddingTop) {
    styles.paddingTop = SPACING_MAP[spacing.paddingTop];
  }
  if (spacing.paddingRight) {
    styles.paddingRight = SPACING_MAP[spacing.paddingRight];
  }
  if (spacing.paddingBottom) {
    styles.paddingBottom = SPACING_MAP[spacing.paddingBottom];
  }
  if (spacing.paddingLeft) {
    styles.paddingLeft = SPACING_MAP[spacing.paddingLeft];
  }

  return styles;
}

// Convert layout config to CSS styles and classes
export function getLayoutStyles(layoutConfig?: LayoutConfig): {
  styles: React.CSSProperties;
  className: string;
} {
  if (!layoutConfig || layoutConfig.type === 'stack') {
    return {
      styles: { display: 'flex', flexDirection: 'column' },
      className: '',
    };
  }

  const styles: React.CSSProperties = {
    display: layoutConfig.type === 'grid' ? 'grid' : 'flex',
  };

  const classNames: string[] = [];

  if (layoutConfig.type === 'row') {
    styles.flexDirection = layoutConfig.reverseDirection ? 'row-reverse' : 'row';
    if (layoutConfig.wrap) {
      styles.flexWrap = 'wrap';
    }
  } else if (layoutConfig.type === 'grid') {
    styles.gridTemplateColumns = `repeat(${layoutConfig.gridColumns || 3}, 1fr)`;
  }

  // Alignment
  if (layoutConfig.alignItems) {
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
      baseline: 'baseline',
    };
    styles.alignItems = alignMap[layoutConfig.alignItems];
  }

  // Justify content
  if (layoutConfig.justifyContent) {
    const justifyMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };
    styles.justifyContent = justifyMap[layoutConfig.justifyContent];
  }

  return { styles, className: classNames.join(' ') };
}

// Convert child config to CSS styles
export function getChildStyles(childConfig?: ChildConfig): React.CSSProperties {
  if (!childConfig) return {};

  const styles: React.CSSProperties = {};

  // Width
  if (childConfig.width) {
    if (childConfig.width === 'custom' && childConfig.customWidth) {
      styles.width = childConfig.customWidth;
    } else if (childConfig.width !== 'auto') {
      styles.width = childConfig.width;
    }
  }

  // Min/Max width
  if (childConfig.minWidth) {
    styles.minWidth = childConfig.minWidth;
  }
  if (childConfig.maxWidth) {
    styles.maxWidth = childConfig.maxWidth;
  }

  // Flex properties
  if (childConfig.flexGrow !== undefined) {
    styles.flexGrow = childConfig.flexGrow;
  }
  if (childConfig.flexShrink !== undefined) {
    styles.flexShrink = childConfig.flexShrink;
  }
  if (childConfig.order !== undefined) {
    styles.order = childConfig.order;
  }

  // Align self
  if (childConfig.alignSelf) {
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
      baseline: 'baseline',
    };
    styles.alignSelf = alignMap[childConfig.alignSelf];
  }

  return styles;
}

// Convert position config to CSS styles
export function getPositionStyles(positionConfig?: PositionConfig): React.CSSProperties {
  if (!positionConfig) return {};

  const styles: React.CSSProperties = {};

  if (positionConfig.offsetX || positionConfig.offsetY) {
    styles.position = 'relative';
    if (positionConfig.offsetX) {
      styles.left = `${positionConfig.offsetX}px`;
    }
    if (positionConfig.offsetY) {
      styles.top = `${positionConfig.offsetY}px`;
    }
  }

  if (positionConfig.zIndex !== undefined) {
    styles.zIndex = positionConfig.zIndex;
  }

  return styles;
}

// Get responsive layout classes
export function getResponsiveLayoutClasses(
  mobileLayout?: 'stack' | 'row' | 'grid',
  tabletLayout?: 'stack' | 'row' | 'grid'
): string {
  const classes: string[] = [];

  // Mobile layout
  if (mobileLayout === 'stack') {
    classes.push('max-md:flex-col');
  }

  // Tablet layout
  if (tabletLayout === 'stack') {
    classes.push('md:max-lg:flex-col');
  }

  return classes.join(' ');
}
