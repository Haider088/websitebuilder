export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export type ComponentCategory = 'layout' | 'content' | 'restaurant' | 'interactive' | 'templates';

export interface RestaurantComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  thumbnail: string;
  defaultProps?: Record<string, any>;
}

export type LayoutType = 'stack' | 'row' | 'grid';
export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type SpacingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type WidthOption = 'auto' | '25%' | '33%' | '50%' | '66%' | '75%' | '100%' | 'custom';

export interface SpacingConfig {
  gap?: SpacingSize;
  marginTop?: SpacingSize;
  marginRight?: SpacingSize;
  marginBottom?: SpacingSize;
  marginLeft?: SpacingSize;
  paddingTop?: SpacingSize;
  paddingRight?: SpacingSize;
  paddingBottom?: SpacingSize;
  paddingLeft?: SpacingSize;
}

export interface LayoutConfig {
  type?: LayoutType;
  gridColumns?: 2 | 3 | 4;
  alignItems?: AlignItems;
  justifyContent?: JustifyContent;
  wrap?: boolean;
  reverseDirection?: boolean;
}

export interface ChildConfig {
  width?: WidthOption;
  customWidth?: string;
  minWidth?: string;
  maxWidth?: string;
  flexGrow?: number;
  flexShrink?: number;
  order?: number;
  alignSelf?: AlignItems;
}

export interface PositionConfig {
  offsetX?: number;
  offsetY?: number;
  zIndex?: number;
}

export interface ResponsiveProps {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  mobileTextAlign?: 'left' | 'center' | 'right';
  mobilePadding?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  mobileWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  mobileLayout?: LayoutType;
  tabletLayout?: LayoutType;
}

export interface FreeformPosition {
  x: number; // grid columns (0-11)
  y: number; // pixels from top
  width: number; // grid columns (1-12)
  height: number; // pixels
}

export interface CanvasComponent {
  id: string;
  componentId: string;
  name: string;
  category: ComponentCategory;
  props: Record<string, any>;
  responsiveProps?: ResponsiveProps;
  interactions?: InteractionSettings;
  formConfig?: import('./forms').FormConfig;
  position: number;
  freeformPosition?: FreeformPosition;
  children?: CanvasComponent[];
  parentId?: string;
  layoutConfig?: LayoutConfig;
  spacing?: SpacingConfig;
  childConfig?: ChildConfig;
  positionConfig?: PositionConfig;
}

export type LayoutMode = 'stack' | 'freeform';

export interface Page {
  id: string;
  name: string;
  slug: string;
  components: CanvasComponent[];
  createdAt: number;
  layoutMode?: LayoutMode;
  props?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
}

export type PropertyTab = 'content' | 'style' | 'layout' | 'responsive' | 'interactions' | 'settings';

export type AnimationType = 'none' | 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce';
export type EasingType = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
export type ClickActionType = 'none' | 'openModal' | 'scrollTo' | 'navigate' | 'externalLink' | 'toggleComponent';

export interface InteractionSettings {
  animation?: {
    type: AnimationType;
    duration?: number; // in ms
    delay?: number; // in ms
    easing?: EasingType;
    triggerOnScroll?: boolean;
    repeat?: boolean;
  };
  hover?: {
    scale?: number;
    rotate?: number;
    translateY?: number;
    opacity?: number;
    backgroundColor?: string;
    borderColor?: string;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  };
  click?: {
    action: ClickActionType;
    target?: string; // component ID, URL, or section ID
    modalContent?: string;
  };
  scroll?: {
    parallax?: boolean;
    parallaxSpeed?: number; // 0.1 to 2
    sticky?: boolean;
    stickyOffset?: number;
  };
}

export interface GlobalSettings {
  branding: {
    siteName: string;
    tagline: string;
    logoText: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: string;
    lineHeight: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    specialHours?: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    yelp: string;
  };
  businessHours: {
    [key: string]: string;
  };
  navigation: {
    items: Array<{ label: string; href: string }>;
  };
  seo?: {
    defaultMetaTitle?: string;
    defaultMetaDescription?: string;
    defaultMetaKeywords?: string;
    ogImage?: string;
    twitterHandle?: string;
    googleAnalyticsId?: string;
    googleSiteVerification?: string;
  };
}

export type AssetCategory = 'food' | 'interior' | 'staff' | 'logo' | 'other' | 'all';

export interface Asset {
  id: string;
  name: string;
  url: string;
  category: AssetCategory;
  size: number;
  type: string;
  uploadedAt: number;
  usedIn: string[]; // Component IDs where this asset is used
}

export interface ProjectVersion {
  id: string;
  name: string;
  description?: string;
  timestamp: number;
  isAutoSave: boolean;
  state: {
    pages: Page[];
    currentPageId: string;
    siteName: string;
    globalSettings: GlobalSettings;
  };
  thumbnail?: string; // Base64 or URL
  componentCount: number;
  pageCount: number;
}

export interface VersionComparison {
  added: number;
  removed: number;
  modified: number;
  pagesChanged: string[];
}

export type IssueLevel = 'critical' | 'warning' | 'info';

export interface AnalyticsIssue {
  id: string;
  type: 'seo' | 'accessibility' | 'performance' | 'best-practice';
  level: IssueLevel;
  title: string;
  description: string;
  pageId?: string;
  componentId?: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ComponentUsageStats {
  componentId: string;
  name: string;
  count: number;
  pages: string[];
}

export interface PageStats {
  id: string;
  name: string;
  componentCount: number;
  formCount: number;
  imageCount: number;
  hasMetaDescription: boolean;
  hasMetaTitle: boolean;
  estimatedSize: number; // in KB
}

export interface SEOScore {
  score: number; // 0-100
  issues: AnalyticsIssue[];
  recommendations: string[];
}

export interface AccessibilityScore {
  score: number; // 0-100
  issues: AnalyticsIssue[];
  recommendations: string[];
}

export interface PerformanceScore {
  score: number; // 0-100
  estimatedLoadTime: number; // in ms
  totalSize: number; // in KB
  imageSize: number;
  issues: AnalyticsIssue[];
  recommendations: string[];
}

export interface ProjectAnalytics {
  overview: {
    totalPages: number;
    totalComponents: number;
    totalForms: number;
    totalAssets: number;
    projectSize: number; // in KB
    lastAnalyzed: number;
  };
  componentUsage: ComponentUsageStats[];
  pageStats: PageStats[];
  seo: SEOScore;
  accessibility: AccessibilityScore;
  performance: PerformanceScore;
  issues: AnalyticsIssue[];
}
