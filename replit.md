# Restaurant Website Builder Interface

## Project Overview
A modern, interactive website builder specifically designed for creating restaurant websites. Built with React, TypeScript, Vite, and Tailwind CSS. Features include drag-and-drop components, templates, AI assistance, form builder, and more.

## Recent Changes

### October 26, 2025 - Stack vs Freeform Layout Modes ✅ COMPLETED
- **New Feature**: Added dual layout system for flexible page design
  - Created `LayoutMode` type ('stack' | 'freeform')
  - Added `layoutMode` property to Page interface with localStorage persistence
  - Added `FreeformPosition` interface for absolute positioning (x, y, width, height)
  - Added `freeformPosition` property to CanvasComponent
- **Canvas Sizing**: Set default canvas to 1400px × 1400px (width × height) with infinite downward expansion
  - Works for both stack and freeform modes
  - Automatically expands as components are added
- **Toolbar Enhancement**: Added Stack/Freeform toggle button
  - Button shows current mode with icon (LayoutList for stack, LayoutGrid for freeform)
  - Highlights when in freeform mode
  - Shows helpful tooltip explaining each mode
  - Persists mode selection across page reloads
- **Stack Mode**: Traditional vertical layout (default)
  - Components stack on top of each other with consistent spacing
  - AI-friendly and predictable
  - Perfect for beginners and content-heavy sites
- **Freeform Mode**: Advanced absolute positioning with full drag & resize
  - 12-column grid overlay for precise visual alignment
  - Drag components anywhere on the canvas - click and drag to reposition
  - **8 resize handles** - 4 corners (NW, NE, SW, SE) + 4 edges (N, S, E, W)
  - Each handle resizes in its intended direction with proper anchor points
  - **Magnetic snapping** - Components snap to each other when within 10px threshold
    - Snaps to all 8 edges: left/right to left/right, top/bottom to top/bottom
    - Works during both dragging and resizing
    - Direction-aware: maintains anchored edges while snapping active edges
    - Components don't move together after snapping (independent positioning)
  - Zoom-aware calculations - drag/resize works correctly at any zoom level (50%, 100%, 200%)
  - Default positioning for new components (cascading offset to prevent overlap)
  - Perfect for unique, professional designs
- **Technical Implementation**:
  - Created `FreeformComponentWrapper` component for drag/resize interactions
  - Implemented zoom-normalized mouse calculations (`zoomFactor = zoom / 100`)
  - Directional resize logic handles all 4 corners with proper x/y adjustments
  - State management persists freeform positions to localStorage
  - Minimum size constraints (100px width, 50px height)
- **Future Enhancements**: Canvas size configuration UI for freeform mode

### October 26, 2025 - Live Custom Component Rendering & Multi-Component Fix
- **Critical Fix**: Fixed state management bug where only the last component appeared when AI added multiple components
  - Updated `useHistory` hook to support functional state updates
  - Refactored `handleDrop` to use functional updates, preventing stale state issues
  - All AI-generated actions now properly accumulate instead of overwriting
- **New Feature**: ✅ Live Custom Component Rendering (WORKING)
  - Installed @babel/standalone for runtime JSX/TypeScript compilation
  - Created `LiveComponentRenderer` that compiles and executes AI-generated React code in real-time
  - Automatic component name detection - works with any component name (BouncingBall, AnimatedCarousel, etc.)
  - AST-based import/export removal handles all module syntax patterns
  - Comprehensive React API support (all hooks, forwardRef, memo, Fragment, etc.)
  - Error boundaries for both compilation and runtime errors with detailed debugging
  - Cleaned up UI: Compact header with Code/Copy buttons that show on hover
  - Removed debug console logs for cleaner user experience
- **How It Works**: 
  - AI generates React components with inline styles or Tailwind classes
  - Babel compiles JSX/TypeScript to executable code in the browser
  - Component extracts any capitalized component name automatically
  - Renders live with full React hook support
- **User Experience**: Restaurant owners can say "add a bouncing ball animation" and it just works!
- **Note**: Custom components work for demo/development. For production use with untrusted code, consider iframe/Web Worker sandboxing

### October 25, 2025 - Initial Setup
- **Initial Replit Setup**: Configured the project to run in the Replit environment
- Created TypeScript configuration files (`tsconfig.json`, `tsconfig.node.json`)
- Created Tailwind CSS configuration (`tailwind.config.js`)
- Created PostCSS configuration with Tailwind CSS v4 plugin (@tailwindcss/postcss)
- Updated Vite configuration to use port 5000, host 0.0.0.0, and allowedHosts: true
- Added "type": "module" to package.json
- Created .gitignore file
- Installed missing dependencies (Tailwind CSS v4, @tailwindcss/postcss, Autoprefixer, TypeScript)
- Configured workflow for development server
- Configured deployment settings for Autoscale deployment
- **Fixed**: Added `allowedHosts: true` to vite.config.ts to allow Replit proxy domains

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **UI Components**: Radix UI components
- **AI Integration**: Google Generative AI (@google/generative-ai)
- **Form Handling**: React Hook Form
- **Charts**: Recharts
- **Animations**: Motion (Framer Motion)

### Key Features
1. **Component Library**: Pre-built restaurant-specific components (Menu Grid, Menu List, Reservation Form, Opening Hours, Contact Info)
2. **AI Assistant**: Integration with Google's Generative AI for content suggestions and multi-component creation
3. **Live Custom Components**: AI-generated React components compile and render in real-time using Babel standalone
4. **Template System**: Pre-made page templates for quick setup
5. **Form Builder**: Custom form creation with validation
6. **Responsive Design**: Mobile-first approach with responsive guides
7. **Analytics Dashboard**: Track website performance
8. **Version History**: Track and restore previous versions
9. **Asset Manager**: Manage images and media
10. **Keyboard Shortcuts**: Productivity features for faster workflow

### Project Structure
```
src/
├── components/        # React components
│   ├── ui/           # Reusable UI components (Radix UI)
│   └── figma/        # Figma-exported components
├── data/             # Static data and templates
├── guidelines/       # Documentation and guides
├── hooks/            # Custom React hooks
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### Configuration Files
- `vite.config.ts`: Vite configuration (port 5000, host 0.0.0.0)
- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration with Tailwind v4 plugin
- `package.json`: Dependencies and scripts

## Development

### Running Locally
```bash
npm run dev
```
Server runs on http://0.0.0.0:5000

### Building for Production
```bash
npm run build
```
Output directory: `build/`

## Deployment
- **Type**: Autoscale (stateless)
- **Build Command**: npm run build
- Automatically deployed when published

## Environment Setup
- Node.js 20
- All dependencies managed via npm
- No environment variables required for basic functionality
- Google Generative AI key required for AI Assistant features

## Notes
- The project uses Tailwind CSS v4, which requires `@tailwindcss/postcss` plugin
- Vite dev server configured for Replit environment with proper host and HMR settings
- All UI components are based on Radix UI primitives for accessibility
