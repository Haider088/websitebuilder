# Restaurant Website Builder Interface

## Project Overview
A modern, interactive website builder specifically designed for creating restaurant websites. Built with React, TypeScript, Vite, and Tailwind CSS. Features include drag-and-drop components, templates, AI assistance, form builder, and more.

## Recent Changes

### October 26, 2025 - Live Custom Component Rendering & Multi-Component Fix
- **Critical Fix**: Fixed state management bug where only the last component appeared when AI added multiple components
  - Updated `useHistory` hook to support functional state updates
  - Refactored `handleDrop` to use functional updates, preventing stale state issues
  - All AI-generated actions now properly accumulate instead of overwriting
- **New Feature**: Live Custom Component Rendering
  - Installed @babel/standalone for runtime JSX/TypeScript compilation
  - Created `LiveComponentRenderer` that compiles and executes AI-generated React code in real-time
  - AST-based import/export removal handles all module syntax patterns
  - Comprehensive React API support (all hooks, forwardRef, memo, Fragment, etc.)
  - Error boundaries for both compilation and runtime errors with detailed debugging
  - Security: Limited global scope access, shadowed dangerous globals (window, document, etc.)
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
