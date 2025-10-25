import { DeviceType } from '../types';

/**
 * Utility hook to get responsive spacing values based on device type
 */
export function useResponsiveSpacing(deviceType: DeviceType = 'desktop') {
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  return {
    // Padding values
    padding: {
      none: 'p-0',
      xs: isMobile ? 'p-2' : 'p-3',
      sm: isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-4',
      md: isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-6',
      lg: isMobile ? 'p-6' : isTablet ? 'p-8' : 'p-8',
      xl: isMobile ? 'p-8' : isTablet ? 'p-10' : 'p-12',
    },
    
    // Gap values
    gap: {
      xs: isMobile ? 'gap-2' : 'gap-3',
      sm: isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-4',
      md: isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-6',
      lg: isMobile ? 'gap-6' : isTablet ? 'gap-8' : 'gap-8',
    },
    
    // Text sizes
    text: {
      xs: isMobile ? 'text-[11px]' : 'text-xs',
      sm: isMobile ? 'text-xs' : 'text-sm',
      base: isMobile ? 'text-sm' : 'text-base',
      lg: isMobile ? 'text-base' : 'text-lg',
      xl: isMobile ? 'text-lg' : 'text-xl',
      '2xl': isMobile ? 'text-xl' : 'text-2xl',
    },
    
    // Heights for touch targets
    touchTarget: {
      sm: isMobile ? 'h-10' : 'h-9',
      md: isMobile ? 'h-11' : 'h-10',
      lg: isMobile ? 'h-12' : 'h-11',
    },
    
    // Icon sizes
    icon: {
      sm: isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4',
      md: isMobile ? 'w-4 h-4' : 'w-5 h-5',
      lg: isMobile ? 'w-6 h-6' : 'w-8 h-8',
      xl: isMobile ? 'w-8 h-8' : 'w-12 h-12',
    },
    
    // Utilities
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
}

/**
 * Get responsive class based on device type
 */
export function getResponsiveClass(
  deviceType: DeviceType,
  mobileClass: string,
  tabletClass: string,
  desktopClass: string
): string {
  if (deviceType === 'mobile') return mobileClass;
  if (deviceType === 'tablet') return tabletClass;
  return desktopClass;
}
