# Mobile Design Guide

## Overview
This guide outlines the mobile-first design principles implemented in the Restaurant Website Builder to ensure mobile sites look and feel native.

## Key Mobile Optimizations

### 1. Responsive Spacing
- **Mobile Padding**: Reduced from desktop (p-8) to mobile (p-4) for better screen utilization
- **Touch Targets**: Minimum 44px height for all interactive elements (buttons, inputs)
- **Gap Spacing**: Smaller gaps on mobile (gap-4 vs gap-6) to fit more content

### 2. Typography Scaling
- **Base Font Size**: 14px on mobile vs 16px on desktop
- **Headings**: Automatically scaled down on mobile
  - H1: 1.75rem (mobile) vs 2xl (desktop)
  - H2: 1.5rem (mobile) vs xl (desktop)
  - H3: 1.25rem (mobile) vs lg (desktop)
- **Line Height**: Increased to 1.6 on mobile for better readability

### 3. Layout Adjustments
- **Grid Columns**: Most multi-column layouts collapse to single column on mobile
- **Hero Sections**: Reduced height on mobile (h-64 vs h-96)
- **Images**: Optimized heights for mobile viewing
- **Full Width**: Buttons and forms use full width on mobile for easier interaction

### 4. Component-Specific Mobile Optimizations

#### Hero Components
- Smaller padding and heights
- Adjusted button sizes
- Responsive text sizing

#### Menu Components
- Single column layout on mobile
- Smaller images and card padding
- Category badges optimized for mobile

#### Forms
- Full-width inputs and buttons
- Larger touch targets (h-11)
- Single column layout
- 16px font size to prevent iOS zoom

#### Navigation & Links
- Larger touch targets
- Adequate spacing between elements
- Mobile-optimized icon sizes

### 5. Device Frames
- **Mobile**: Rounded device frame (border-radius: 3rem) with device bezel
- **Tablet**: Rounded corners (border-radius: 2rem) with smaller bezel
- **Desktop**: No frame, full-width display

## Best Practices

### For Restaurant Owners
1. Always preview your site in mobile view
2. Test all forms and buttons for easy thumb access
3. Keep text concise on mobile
4. Use high-quality images that look good at smaller sizes
5. Ensure contact information is easily accessible

### For Developers
1. Always think mobile-first when adding new components
2. Use the `deviceType` prop to conditionally render mobile-optimized layouts
3. Follow the spacing patterns established in existing components
4. Test on actual mobile devices when possible
5. Use the `useResponsiveSpacing` hook for consistent spacing

## Breakpoints
- **Mobile**: < 768px (375px viewport in builder)
- **Tablet**: 768px - 1023px (768px viewport in builder)
- **Desktop**: ≥ 1024px (100% viewport in builder)

## Touch Targets
All interactive elements should have a minimum touch target of:
- **Minimum**: 44px × 44px (Apple HIG recommendation)
- **Preferred**: 48px × 48px (Material Design recommendation)

## Performance Considerations
- Images are optimized with `loading="lazy"` by default
- Font size adjustments prevent iOS auto-zoom on input focus
- Hardware acceleration enabled with `-webkit-font-smoothing`
- Tap highlight removed for cleaner mobile experience

## Testing Checklist
- [ ] All text is readable without zooming
- [ ] All buttons and links are easily tappable
- [ ] Forms work well with mobile keyboards
- [ ] Images load quickly and look good
- [ ] No horizontal scrolling
- [ ] Adequate spacing between interactive elements
- [ ] Content doesn't feel cramped
- [ ] Navigation is intuitive
