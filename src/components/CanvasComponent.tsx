import { useState } from 'react';
import { CanvasComponent as CanvasComponentType, DeviceType, AnimationType } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Clock, 
  Mail, 
  MapPin, 
  Phone, 
  Star,
  ChefHat,
  Calendar,
  Send,
  Bell,
  Smartphone
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useParallax } from '../hooks/useParallax';
import { toast } from 'sonner@2.0.3';
import { FormRenderer } from './FormRenderer';
import { CustomComponentRenderer } from './CustomComponentRenderer';
import { 
  getSpacingStyles, 
  getLayoutStyles, 
  getChildStyles, 
  getPositionStyles,
  getResponsiveLayoutClasses 
} from '../utils/layoutUtils';

interface CanvasComponentProps {
  component: CanvasComponentType;
  isSelected: boolean;
  deviceType?: DeviceType;
  onSelect: (e: React.MouseEvent) => void;
  onDropIntoContainer?: (parentId: string) => void;
  draggedComponent?: any;
}

export function CanvasComponent({ 
  component, 
  isSelected, 
  deviceType = 'desktop', 
  onSelect,
  onDropIntoContainer,
  draggedComponent 
}: CanvasComponentProps) {
  const interactions = component.interactions;
  
  // Check if component has responsive settings
  const hasResponsiveSettings = component.responsiveProps && (
    component.responsiveProps.hideOnMobile ||
    component.responsiveProps.hideOnTablet ||
    component.responsiveProps.hideOnDesktop ||
    component.responsiveProps.mobileTextAlign ||
    component.responsiveProps.mobilePadding ||
    component.responsiveProps.mobileWidth
  );

  // Scroll animation hook
  const scrollAnimation = useScrollAnimation(
    interactions?.animation?.type || 'none',
    {
      enabled: interactions?.animation?.triggerOnScroll || false,
      once: !interactions?.animation?.repeat,
    }
  );

  // Parallax hook
  const parallax = useParallax(
    interactions?.scroll?.parallaxSpeed || 0.5,
    interactions?.scroll?.parallax || false
  );

  // Helper to get animation initial state
  const getAnimationInitial = (type: AnimationType) => {
    switch (type) {
      case 'fade':
        return { opacity: 0 };
      case 'slideUp':
        return { opacity: 0, y: 50 };
      case 'slideDown':
        return { opacity: 0, y: -50 };
      case 'slideLeft':
        return { opacity: 0, x: 50 };
      case 'slideRight':
        return { opacity: 0, x: -50 };
      case 'scale':
        return { opacity: 0, scale: 0.8 };
      case 'bounce':
        return { opacity: 0, scale: 0.8 };
      default:
        return {};
    }
  };

  // Helper to get animation animate state
  const getAnimationAnimate = (type: AnimationType, isVisible: boolean) => {
    if (!isVisible) return getAnimationInitial(type);
    
    switch (type) {
      case 'fade':
      case 'slideUp':
      case 'slideDown':
      case 'slideLeft':
      case 'slideRight':
        return { opacity: 1, x: 0, y: 0 };
      case 'scale':
      case 'bounce':
        return { opacity: 1, scale: 1 };
      default:
        return { opacity: 1 };
    }
  };

  // Helper to get transition config
  const getTransition = () => {
    const animation = interactions?.animation;
    if (!animation) return undefined;

    const config: any = {
      duration: (animation.duration || 600) / 1000,
      delay: (animation.delay || 0) / 1000,
      ease: animation.easing || 'ease-out',
    };

    if (animation.type === 'bounce') {
      config.type = 'spring';
      config.bounce = 0.5;
    }

    return config;
  };

  // Helper to get hover state
  const getHoverState = () => {
    const hover = interactions?.hover;
    if (!hover) return undefined;

    const state: any = {};
    
    if (hover.scale !== undefined) state.scale = hover.scale;
    if (hover.rotate !== undefined) state.rotate = hover.rotate;
    if (hover.translateY !== undefined) state.y = hover.translateY;
    if (hover.opacity !== undefined) state.opacity = hover.opacity;

    return Object.keys(state).length > 0 ? state : undefined;
  };

  // Handle click actions
  const handleClick = (e: React.MouseEvent) => {
    const click = interactions?.click;
    
    if (click?.action && click.action !== 'none') {
      e.stopPropagation();
      
      switch (click.action) {
        case 'scrollTo':
          if (click.target) {
            const element = document.querySelector(click.target);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              toast.error(`Section "${click.target}" not found`);
            }
          }
          break;
        case 'navigate':
          if (click.target) {
            toast.info(`Would navigate to: ${click.target}`);
            // In a real app: router.push(click.target)
          }
          break;
        case 'externalLink':
          if (click.target) {
            window.open(click.target, '_blank', 'noopener,noreferrer');
          }
          break;
        case 'openModal':
          if (click.target) {
            toast.info(click.target);
            // In a real app: open modal with content
          }
          break;
      }
    } else {
      onSelect(e);
    }
  };

  // Helper function to build className from style/layout props
  const getWrapperClasses = () => {
    const props = component.props;
    const classes: string[] = [];

    // Background color
    if (props.backgroundColor && props.backgroundColor !== 'transparent') {
      const bgMap: Record<string, string> = {
        white: 'bg-white',
        muted: 'bg-muted',
        accent: 'bg-accent',
        primary: 'bg-primary',
        secondary: 'bg-secondary',
      };
      classes.push(bgMap[props.backgroundColor] || '');
    }

    // Text color
    if (props.textColor && props.textColor !== 'default') {
      const colorMap: Record<string, string> = {
        muted: 'text-muted-foreground',
        white: 'text-white',
        primary: 'text-primary',
      };
      classes.push(colorMap[props.textColor] || '');
    }

    // Text alignment
    if (props.textAlign) {
      const alignMap: Record<string, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      };
      classes.push(alignMap[props.textAlign] || '');
    }

    // Responsive mobile text alignment
    const responsiveProps = component.responsiveProps;
    if (responsiveProps?.mobileTextAlign && deviceType === 'mobile') {
      const mobileAlignMap: Record<string, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      };
      classes.push(mobileAlignMap[responsiveProps.mobileTextAlign] || '');
    }

    // Border radius
    if (props.borderRadius) {
      const radiusMap: Record<string, string> = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      };
      classes.push(radiusMap[props.borderRadius] || '');
    }

    // Shadow
    if (props.shadow) {
      classes.push('shadow-lg');
    }

    // Width
    if (props.width) {
      const widthMap: Record<string, string> = {
        sm: 'max-w-screen-sm mx-auto',
        md: 'max-w-screen-md mx-auto',
        lg: 'max-w-screen-lg mx-auto',
        xl: 'max-w-screen-xl mx-auto',
        full: 'w-full',
      };
      classes.push(widthMap[props.width] || '');
    }

    // Responsive mobile width
    if (responsiveProps?.mobileWidth && deviceType === 'mobile') {
      const mobileWidthMap: Record<string, string> = {
        sm: 'max-w-sm mx-auto',
        md: 'max-w-md mx-auto',
        lg: 'max-w-lg mx-auto',
        xl: 'max-w-xl mx-auto',
        full: 'w-full',
      };
      classes.push(mobileWidthMap[responsiveProps.mobileWidth] || '');
    }

    // Padding - apply mobile/tablet responsive defaults if no explicit responsive props
    if (props.padding) {
      if (responsiveProps?.mobilePadding && deviceType === 'mobile') {
        const mobilePaddingMap: Record<string, string> = {
          none: 'p-0',
          small: 'p-3',
          medium: 'p-4',
          large: 'p-6',
          xl: 'p-8',
        };
        classes.push(mobilePaddingMap[responsiveProps.mobilePadding] || '');
      } else if (deviceType === 'mobile' && !responsiveProps?.mobilePadding) {
        // Auto-adjust padding on mobile if no override
        const mobilePaddingMap: Record<string, string> = {
          none: 'p-0',
          small: 'p-3',
          medium: 'p-4',
          large: 'p-6',
          xl: 'p-8',
        };
        classes.push(mobilePaddingMap[props.padding] || '');
      } else {
        const paddingMap: Record<string, string> = {
          none: 'p-0',
          small: 'p-4',
          medium: 'p-8',
          large: 'p-12',
          xl: 'p-16',
        };
        classes.push(paddingMap[props.padding] || '');
      }
    }

    // Margin top
    if (props.marginTop) {
      const marginMap: Record<string, string> = {
        none: 'mt-0',
        small: 'mt-4',
        medium: 'mt-8',
        large: 'mt-12',
        xl: 'mt-16',
      };
      classes.push(marginMap[props.marginTop] || '');
    }

    // Margin bottom
    if (props.marginBottom) {
      const marginMap: Record<string, string> = {
        none: 'mb-0',
        small: 'mb-4',
        medium: 'mb-8',
        large: 'mb-12',
        xl: 'mb-16',
      };
      classes.push(marginMap[props.marginBottom] || '');
    }

    // Center horizontally
    if (props.centerHorizontally) {
      classes.push('mx-auto');
    }

    // Full height
    if (props.fullHeight) {
      classes.push('min-h-screen');
    }

    return classes.filter(Boolean).join(' ');
  };

  const renderComponent = () => {
    const props = component.props;
    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType === 'tablet';

    switch (component.componentId) {
      // Custom Components
      case 'custom': {
        return (
          <CustomComponentRenderer
            name={component.name}
            code={props.code || '// No code provided'}
            description={props.description}
            props={props}
          />
        );
      }
      
      // Container Components
      case 'row-container':
      case 'grid-container': {
        const layoutConfig = component.layoutConfig || {
          type: component.componentId === 'row-container' ? 'row' : 'grid',
          gridColumns: 3,
          alignItems: 'start',
          justifyContent: 'start',
        };
        
        const { styles: layoutStyles, className: layoutClasses } = getLayoutStyles(layoutConfig);
        const spacingStyles = getSpacingStyles(component.spacing);
        const responsiveClasses = getResponsiveLayoutClasses(
          component.responsiveProps?.mobileLayout,
          component.responsiveProps?.tabletLayout
        );
        
        const [isHoveringContainer, setIsHoveringContainer] = useState(false);
        
        return (
          <div 
            style={{ ...layoutStyles, ...spacingStyles }}
            className={`${layoutClasses} ${responsiveClasses} ${props.backgroundColor ? '' : 'bg-muted/20'} ${props.borderRadius ? '' : 'rounded-lg'} transition-all min-h-[100px] ${isHoveringContainer && draggedComponent ? 'ring-2 ring-primary' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHoveringContainer(true);
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              setIsHoveringContainer(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHoveringContainer(false);
              if (onDropIntoContainer) {
                onDropIntoContainer(component.id);
              }
            }}
          >
            {component.children && component.children.length > 0 ? (
              component.children.map((child) => (
                <div
                  key={child.id}
                  style={{
                    ...getChildStyles(child.childConfig),
                    ...getPositionStyles(child.positionConfig)
                  }}
                >
                  <CanvasComponent
                    component={child}
                    isSelected={false}
                    deviceType={deviceType}
                    onSelect={onSelect}
                    onDropIntoContainer={onDropIntoContainer}
                    draggedComponent={draggedComponent}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full p-8 text-muted-foreground text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-2">{component.componentId === 'row-container' ? '⬌' : '▦'}</div>
                  <div>Drop components here</div>
                  <div className="text-xs mt-1">
                    {component.componentId === 'row-container' 
                      ? 'Arrange components side by side' 
                      : `${layoutConfig.gridColumns || 3} column grid layout`}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'hero-full':
        const overlayOpacity = props.overlayOpacity ?? 50;
        const heroBackgroundImage = props.backgroundImage 
          ? (props.backgroundImage.startsWith('http') 
              ? props.backgroundImage 
              : `https://source.unsplash.com/1920x1080/?${encodeURIComponent(props.backgroundImage)}`)
          : 'https://images.unsplash.com/photo-1667388968964-4aa652df0a9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3IlMjBkaW5pbmd8ZW58MXx8fHwxNzYwNTk2ODg3fDA&ixlib=rb-4.1.0&q=80&w=1080';
        return (
          <div className={`relative w-full overflow-hidden rounded-lg ${isMobile ? 'h-64' : isTablet ? 'h-80' : 'h-96'}`}>
            <ImageWithFallback
              src={heroBackgroundImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div 
              className={`absolute inset-0 flex flex-col items-center justify-center text-white ${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'}`}
              style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
            >
              <h1 className={`mb-4 text-center ${isMobile ? 'text-2xl' : ''}`}>{props.title || 'Welcome to Our Restaurant'}</h1>
              <p className={`mb-6 text-center ${isMobile ? 'text-sm' : ''}`}>{props.subtitle || 'Experience culinary excellence'}</p>
              <Button size={isMobile ? 'default' : 'lg'}>{props.buttonText || 'View Menu'}</Button>
            </div>
          </div>
        );

      case 'hero-split':
        const heroSplitImage = props.imageUrl 
          ? (props.imageUrl.startsWith('http') 
              ? props.imageUrl 
              : `https://source.unsplash.com/1920x1080/?${encodeURIComponent(props.imageUrl)}`)
          : 'https://images.unsplash.com/photo-1696805566858-fe4a670d5df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbWVudSUyMGRpc2hlc3xlbnwxfHx8fDE3NjA2NDg0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080';
        return (
          <div className={`grid gap-6 items-center ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2'}`}>
            <div className={isMobile ? 'order-1' : (props.imagePosition === 'right' ? 'order-1' : 'order-2')}>
              <h1 className={`mb-4 ${isMobile ? 'text-2xl' : ''}`}>{props.title || 'Authentic Flavors'}</h1>
              <p className={`mb-6 ${isMobile ? 'text-sm' : ''}`}>{props.description || 'Discover our signature dishes'}</p>
              <Button className={isMobile ? 'w-full' : ''}>Learn More</Button>
            </div>
            <div className={isMobile ? 'order-2' : (props.imagePosition === 'right' ? 'order-2' : 'order-1')}>
              <ImageWithFallback
                src={heroSplitImage}
                alt="Food"
                className={`w-full object-cover rounded-lg ${isMobile ? 'h-48' : 'h-80'}`}
              />
            </div>
          </div>
        );

      case 'two-column':
      case 'three-column': {
        const columns = component.componentId === 'three-column' ? 3 : 2;
        const hasChildren = component.children && component.children.length > 0;
        const [isHoveringColumn, setIsHoveringColumn] = useState(false);
        
        return (
          <div 
            className={`grid ${isMobile ? 'grid-cols-1 gap-4' : `gap-6 ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`} ${isHoveringColumn && draggedComponent ? 'ring-2 ring-primary rounded-lg' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHoveringColumn(true);
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              setIsHoveringColumn(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHoveringColumn(false);
              if (onDropIntoContainer) {
                onDropIntoContainer(component.id);
              }
            }}
          >
            {hasChildren ? (
              component.children.slice(0, columns).map((child, i) => (
                <div key={child.id} style={getChildStyles(child.childConfig)}>
                  <CanvasComponent
                    component={child}
                    isSelected={false}
                    deviceType={deviceType}
                    onSelect={onSelect}
                    onDropIntoContainer={onDropIntoContainer}
                    draggedComponent={draggedComponent}
                  />
                </div>
              ))
            ) : (
              Array.from({ length: columns }).map((_, i) => (
                <div key={i} className={`bg-muted/30 rounded-lg border-2 border-dashed border-border ${isMobile ? 'p-4' : 'p-6'} flex items-center justify-center min-h-[150px]`}>
                  <div className="text-center text-muted-foreground">
                    <div className="text-sm mb-1">Column {i + 1}</div>
                    <div className="text-xs">Drop component here</div>
                  </div>
                </div>
              ))
            )}
            {/* Show additional empty columns if we have fewer children than columns */}
            {hasChildren && component.children.length < columns && 
              Array.from({ length: columns - component.children.length }).map((_, i) => (
                <div key={`empty-${i}`} className={`bg-muted/30 rounded-lg border-2 border-dashed border-border ${isMobile ? 'p-4' : 'p-6'} flex items-center justify-center min-h-[150px]`}>
                  <div className="text-center text-muted-foreground">
                    <div className="text-sm mb-1">Column {component.children.length + i + 1}</div>
                    <div className="text-xs">Drop component here</div>
                  </div>
                </div>
              ))
            }
          </div>
        );
      }

      case 'text-block':
        return (
          <div className={isMobile ? 'w-full' : 'max-w-3xl'}>
            <h2 className={`mb-4 ${isMobile ? 'text-xl' : ''}`}>{props.heading || 'Our Story'}</h2>
            <p className={isMobile ? 'text-sm leading-relaxed' : ''}>{props.content || "Share your restaurant's story and values..."}</p>
          </div>
        );

      case 'image-gallery':
        const galleryColumns = isMobile ? 2 : (props.columns === 4 ? 4 : props.columns === 3 ? 3 : 2);
        return (
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : `gap-4 ${props.columns === 4 ? 'grid-cols-4' : props.columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1696805566858-fe4a670d5df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbWVudSUyMGRpc2hlc3xlbnwxfHx8fDE3NjA2NDg0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&sig=${i}`}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        );

      case 'menu-grid':
        return (
          <div>
            <div className={`flex gap-2 flex-wrap ${isMobile ? 'mb-4' : 'mb-6'}`}>
              {(props.categories || ['All', 'Appetizers', 'Main Course', 'Desserts']).map((cat: string) => (
                <Badge key={cat} variant="outline" className={`cursor-pointer hover:bg-primary hover:text-primary-foreground ${isMobile ? 'text-xs px-2 py-1' : ''}`}>
                  {cat}
                </Badge>
              ))}
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'gap-6 md:grid-cols-2 lg:grid-cols-3'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {props.showImages && (
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1696805566858-fe4a670d5df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwbWVudSUyMGRpc2hlc3xlbnwxfHx8fDE3NjA2NDg0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&sig=menu${i}`}
                      alt={`Dish ${i + 1}`}
                      className={`w-full object-cover ${isMobile ? 'h-40' : 'h-48'}`}
                    />
                  )}
                  <div className={isMobile ? 'p-3' : 'p-4'}>
                    <div className={`flex justify-between items-start ${isMobile ? 'mb-1' : 'mb-2'}`}>
                      <h3 className={isMobile ? 'text-base' : ''}>Dish Name {i + 1}</h3>
                      {props.showPrices && <span className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>${(15 + i * 3).toFixed(2)}</span>}
                    </div>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>Delicious description of the dish...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'menu-list':
        return (
          <div className={isMobile ? 'space-y-6' : 'space-y-8'}>
            {['Appetizers', 'Main Course', 'Desserts'].map((category) => (
              <div key={category}>
                <h2 className={`pb-2 border-b border-border ${isMobile ? 'text-xl mb-3' : 'mb-4'}`}>{category}</h2>
                <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className={isMobile ? 'text-base' : ''}> Name {i + 1}</h4>
                        {props.showDescriptions && (
                          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>Fresh ingredients, expertly prepared</p>
                        )}
                      </div>
                      <span className={`font-semibold flex-shrink-0 ${isMobile ? 'text-sm' : ''}`}>${(12 + i * 2).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'reservations':
        return (
          <div className={`mx-auto border border-border rounded-lg ${isMobile ? 'p-4 w-full' : 'max-w-2xl p-6'}`}>
            <h2 className={`flex items-center gap-2 ${isMobile ? 'text-xl mb-4' : 'mb-6'}`}>
              <Calendar className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              Make a Reservation
            </h2>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
              <Input placeholder="Name" className={isMobile ? 'h-11' : ''} />
              <Input placeholder="Email" type="email" className={isMobile ? 'h-11' : ''} />
              <Input placeholder="Phone" type="tel" className={isMobile ? 'h-11' : ''} />
              <Input placeholder="Number of Guests" type="number" className={isMobile ? 'h-11' : ''} />
              <Input placeholder="Date" type="date" className={isMobile ? 'h-11' : ''} />
              <Input placeholder="Time" type="time" className={isMobile ? 'h-11' : ''} />
            </div>
            <Button className={`w-full mt-6 ${isMobile ? 'h-11' : ''}`}>Book Table</Button>
          </div>
        );

      case 'hours':
        return (
          <div className={isMobile ? 'w-full' : 'max-w-md'}>
            <h3 className={`flex items-center gap-2 ${isMobile ? 'text-lg mb-3' : 'mb-4'}`}>
              <Clock className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              Opening Hours
            </h3>
            <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
              {(props.days || [
                { day: 'Monday - Friday', hours: '11:00 AM - 10:00 PM' },
                { day: 'Saturday - Sunday', hours: '10:00 AM - 11:00 PM' }
              ]).map((schedule: any, i: number) => (
                <div key={i} className={`flex justify-between border-b border-border ${isMobile ? 'py-1.5 text-sm' : 'py-2'}`}>
                  <span className={isMobile ? 'text-sm' : ''}>{schedule.day}</span>
                  <span className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact-info':
        return (
          <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
            <h3 className={isMobile ? 'mb-3 text-lg' : 'mb-4'}>Contact Us</h3>
            <div className={`flex items-start gap-3 ${isMobile ? 'gap-2' : ''}`}>
              <Phone className={`text-muted-foreground flex-shrink-0 mt-0.5 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={isMobile ? 'text-sm' : ''}>{props.phone || '(555) 123-4567'}</span>
            </div>
            <div className={`flex items-start gap-3 ${isMobile ? 'gap-2' : ''}`}>
              <Mail className={`text-muted-foreground flex-shrink-0 mt-0.5 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={isMobile ? 'text-sm' : ''}>{props.email || 'info@restaurant.com'}</span>
            </div>
            <div className={`flex items-start gap-3 ${isMobile ? 'gap-2' : ''}`}>
              <MapPin className={`text-muted-foreground flex-shrink-0 mt-0.5 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={isMobile ? 'text-sm' : ''}>{props.address || '123 Main Street, City, State 12345'}</span>
            </div>
          </div>
        );

      case 'location-map':
        return (
          <div className={`w-full bg-muted rounded-lg flex items-center justify-center ${isMobile ? 'h-64' : 'h-96'}`}>
            <div className="text-center">
              <MapPin className={`mx-auto mb-2 text-muted-foreground ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>Map View</p>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs px-4' : ''}`}>{props.address || '123 Main Street'}</p>
            </div>
          </div>
        );

      case 'chef-profile':
        return (
          <div className={`flex items-start ${isMobile ? 'flex-col gap-4' : 'flex-col md:flex-row gap-6'}`}>
            <div className={`bg-muted rounded-lg flex-shrink-0 flex items-center justify-center ${isMobile ? 'w-full h-40' : 'w-48 h-48'}`}>
              <ChefHat className={`text-muted-foreground ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
            </div>
            <div className="flex-1">
              <h2 className={`mb-2 ${isMobile ? 'text-xl' : ''}`}>{props.name || 'Chef Name'}</h2>
              <p className={`mb-4 ${isMobile ? 'text-sm' : ''}`}>{props.bio || 'Meet our talented chef with years of culinary experience...'}</p>
              {props.specialties && props.specialties.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {props.specialties.map((specialty: string, i: number) => (
                    <Badge key={i} variant="secondary" className={isMobile ? 'text-xs' : ''}>{specialty}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'gap-6 md:grid-cols-3'}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`border border-border rounded-lg ${isMobile ? 'p-4' : 'p-6'}`}>
                {props.showRating && (
                  <div className={`flex gap-1 ${isMobile ? 'mb-2' : 'mb-3'}`}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`fill-yellow-400 text-yellow-400 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    ))}
                  </div>
                )}
                <p className={`text-muted-foreground ${isMobile ? 'mb-3 text-sm' : 'mb-4'}`}>
                  "Amazing food and excellent service! Highly recommend this restaurant."
                </p>
                <h4 className={isMobile ? 'text-sm' : ''}>Customer {i + 1}</h4>
              </div>
            ))}
          </div>
        );

      case 'contact-form':
        return (
          <div className={isMobile ? 'w-full' : 'max-w-2xl mx-auto'}>
            <h2 className={`flex items-center gap-2 ${isMobile ? 'text-xl mb-4' : 'mb-6'}`}>
              <Send className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              Get in Touch
            </h2>
            <div className="space-y-4">
              <Input placeholder="Name" className={isMobile ? 'h-11' : ''} />
              <Input placeholder="Email" type="email" className={isMobile ? 'h-11' : ''} />
              <Input placeholder="Subject" className={isMobile ? 'h-11' : ''} />
              <Textarea placeholder="Message" rows={isMobile ? 4 : 5} className={isMobile ? 'text-sm' : ''} />
              <Button className={`w-full ${isMobile ? 'h-11' : ''}`}>Send Message</Button>
            </div>
          </div>
        );

      case 'contact-form':
      case 'newsletter':
      case 'reservations':
        // If formConfig exists, use FormRenderer
        if (component.formConfig) {
          return <FormRenderer config={component.formConfig} />;
        }
        
        // Fallback to default newsletter UI if no formConfig
        if (component.componentId === 'newsletter') {
          return (
            <div className={`bg-muted rounded-lg text-center ${isMobile ? 'p-6' : 'p-8'}`}>
              <Bell className={`mx-auto mb-4 text-muted-foreground ${isMobile ? 'w-8 h-8' : 'w-12 h-12'}`} />
              <h3 className={`mb-2 ${isMobile ? 'text-lg' : ''}`}>{props.title || 'Stay Updated'}</h3>
              <p className={`text-muted-foreground ${isMobile ? 'mb-4 text-sm' : 'mb-6'}`}>Subscribe to our newsletter for special offers</p>
              <div className={`mx-auto ${isMobile ? 'flex flex-col gap-2' : 'flex gap-2 max-w-md'}`}>
                <Input 
                  placeholder={props.placeholder || 'Enter your email'} 
                  type="email" 
                  className={`flex-1 ${isMobile ? 'h-11' : ''}`} 
                />
                <Button className={isMobile ? 'w-full h-11' : ''}>Subscribe</Button>
              </div>
            </div>
          );
        }
        
        // Default form placeholder for contact-form and reservations
        return (
          <div className={`border-2 border-dashed border-border rounded-lg text-center ${isMobile ? 'p-6' : 'p-8'}`}>
            <h3 className={`mb-2 ${isMobile ? 'text-lg' : ''}`}>
              {component.componentId === 'contact-form' ? 'Contact Form' : 'Reservation Form'}
            </h3>
            <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-sm' : ''}`}>
              Configure form in the Form tab →
            </p>
            <Button variant="outline" size="sm">Configure Form</Button>
          </div>
        );

      case 'social-links':
        return (
          <div className={`flex justify-center ${isMobile ? 'gap-3' : 'gap-4'}`}>
            {(props.platforms || ['Facebook', 'Instagram', 'Twitter']).map((platform: string) => (
              <Button 
                key={platform} 
                variant="outline" 
                size={isMobile ? 'default' : 'icon'} 
                className={`rounded-full ${isMobile ? 'w-11 h-11 p-0' : ''}`}
              >
                <span className={isMobile ? 'text-sm' : ''}>{platform[0]}</span>
              </Button>
            ))}
          </div>
        );

      case 'video-embed':
        return (
          <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className={`mx-auto mb-2 bg-background rounded-full flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                <div className={`w-0 h-0 border-t-transparent border-l-foreground border-b-transparent ml-1 ${
                  isMobile ? 'border-t-6 border-l-9 border-b-6' : 'border-t-8 border-l-12 border-b-8'
                }`} />
              </div>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>Video Player</p>
            </div>
          </div>
        );

      default:
        return (
          <div className={`border border-dashed border-border rounded-lg text-center ${isMobile ? 'p-6' : 'p-8'}`}>
            <h3 className={`mb-2 ${isMobile ? 'text-lg' : ''}`}>{component.name}</h3>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>Component preview</p>
          </div>
        );
    }
  };

  const wrapperClasses = getWrapperClasses();
  
  // Handle group/container rendering
  const content = component.componentId === 'group' || component.props?.isContainer ? (
    <div className="min-h-[100px] border-2 border-dashed border-border rounded-lg p-4">
      <div className="text-sm text-muted-foreground mb-2">
        {component.componentId === 'group' ? 'Group' : 'Container'} - Drop components here
      </div>
      {component.children && component.children.length > 0 && (
        <div className="space-y-4">
          {component.children.map((child) => (
            <div key={child.id} className="p-4 bg-muted rounded">
              <div className="text-sm">{child.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    renderComponent()
  );

  // Build hover styles for CSS-based hover effects
  const hoverStyles: React.CSSProperties = {};
  if (interactions?.hover?.backgroundColor) {
    hoverStyles['--hover-bg' as any] = interactions.hover.backgroundColor;
  }
  if (interactions?.hover?.borderColor) {
    hoverStyles['--hover-border' as any] = interactions.hover.borderColor;
  }

  // Build additional classes for hover shadow
  const hoverClasses = interactions?.hover?.shadow && interactions.hover.shadow !== 'none'
    ? `hover-shadow-${interactions.hover.shadow}`
    : '';

  // Sticky positioning
  const stickyStyles: React.CSSProperties = {};
  if (interactions?.scroll?.sticky) {
    stickyStyles.position = 'sticky';
    stickyStyles.top = `${interactions.scroll.stickyOffset || 0}px`;
    stickyStyles.zIndex = 10;
  }

  // Parallax transform
  const parallaxStyles: React.CSSProperties = {};
  if (interactions?.scroll?.parallax && parallax.offset !== 0) {
    parallaxStyles.transform = `translateY(${-parallax.offset}px)`;
  }

  // Determine if we should use Motion wrapper
  const hasAnimations = interactions?.animation?.type && interactions.animation.type !== 'none';
  const hasHoverEffects = interactions?.hover && (
    interactions.hover.scale !== undefined ||
    interactions.hover.rotate !== undefined ||
    interactions.hover.translateY !== undefined ||
    interactions.hover.opacity !== undefined
  );
  const hasClickAction = interactions?.click?.action && interactions.click.action !== 'none';
  const useMotion = hasAnimations || hasHoverEffects;

  // Merge refs for parallax and scroll animation
  const mergedRef = (el: HTMLDivElement | null) => {
    if (interactions?.scroll?.parallax) {
      parallax.ref.current = el;
    }
    if (interactions?.animation?.triggerOnScroll) {
      scrollAnimation.ref.current = el;
    }
  };

  const WrapperComponent = useMotion ? motion.div : 'div';
  const motionProps = useMotion ? {
    initial: hasAnimations && interactions?.animation?.triggerOnScroll 
      ? getAnimationInitial(interactions.animation.type!)
      : hasAnimations
      ? getAnimationInitial(interactions.animation.type!)
      : undefined,
    animate: hasAnimations && interactions?.animation?.triggerOnScroll
      ? getAnimationAnimate(interactions.animation.type!, scrollAnimation.isVisible)
      : hasAnimations
      ? getAnimationAnimate(interactions.animation.type!, true)
      : undefined,
    transition: hasAnimations ? getTransition() : undefined,
    whileHover: hasHoverEffects ? getHoverState() : undefined,
  } : {};

  const isLocked = component.props?.locked === true;
  const isHidden = component.props?.visible === false;

  // Apply layout utility styles
  const spacingStyles = getSpacingStyles(component.spacing);
  const positionStyles = getPositionStyles(component.positionConfig);
  const childStyles = getChildStyles(component.childConfig);

  return (
    <WrapperComponent
      {...(useMotion ? motionProps : {})}
      ref={useMotion ? mergedRef : undefined}
      onClick={hasClickAction ? handleClick : onSelect}
      style={{ 
        ...stickyStyles, 
        ...parallaxStyles, 
        ...hoverStyles, 
        ...spacingStyles, 
        ...positionStyles,
        ...childStyles 
      }}
      className={`relative group cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-primary/50'
      } ${isLocked ? 'opacity-60' : ''} ${wrapperClasses} ${hoverClasses}`}
    >
      {content}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-10 flex items-center gap-1.5 shadow-lg">
          {component.name}
          {hasResponsiveSettings && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-primary-foreground/20 rounded text-[10px]" title="Has responsive settings">
              <Smartphone className="w-2.5 h-2.5" />
            </span>
          )}
          {isLocked && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-500/90 text-yellow-950 rounded text-[10px]" title="Locked">
              🔒
            </span>
          )}
        </div>
      )}
    </WrapperComponent>
  );
}
