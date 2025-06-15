# Inner DNA Assessment Platform

## Overview

This is a full-stack web application for conducting personality assessments based on the Inner DNA methodology. The platform guides users through a multi-stage assessment process involving foundation stones, building blocks, color states, and detail tokens to determine their personality type.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and bundling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Context for assessment state and user data
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for interactive elements
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Storage**: In-memory storage with fallback for PostgreSQL sessions
- **API Design**: RESTful endpoints for user management and assessment data

### Development Environment
- **Platform**: Replit with Node.js 20, web, and PostgreSQL 16 modules
- **Hot Reload**: Vite development server with HMR
- **Build Process**: Vite for client bundling, esbuild for server bundling

## Key Components

### Assessment Flow
1. **Welcome Screen**: User registration with email and optional name fields
2. **Foundation Stones**: 9 sets of 3 stones each representing core personality dimensions
3. **Building Blocks**: Selection of personality building blocks that stack visually
4. **Color States**: Selection of up to 3 emotional/behavioral states
5. **Detail Tokens**: Fine-grained personality nuances across multiple categories
6. **Results**: Calculated personality type with confidence scoring

### Data Models
- **Users Table**: Stores user information, timestamps, and assessment data as JSONB
- **Assessment Data**: Structured data containing all user selections and calculated results
- **Personality Types**: Algorithm-based scoring system with confidence levels

### UI Components
- **Stone Component**: Interactive selection elements with gradients and animations
- **Tower Visualization**: Visual representation of selected building blocks
- **Progress Tracking**: Multi-step progress indication
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

1. **User Registration**: Creates user record with start timestamp
2. **Assessment Progress**: Each selection updates assessment data via PATCH requests
3. **Real-time Updates**: Context state synchronizes with backend storage
4. **Result Calculation**: Algorithm processes all selections to determine personality type
5. **Completion**: Final results saved with completion timestamp

## External Dependencies

### Production Dependencies
- **Database**: Neon Database for serverless PostgreSQL hosting
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: TanStack Query for server state caching
- **Animations**: Framer Motion for smooth interactions

### Development Dependencies
- **TypeScript**: Full type safety across client and server
- **Drizzle Kit**: Database schema management and migrations
- **Vite Plugins**: Runtime error overlay and development enhancements

## Deployment Strategy

### Build Process
- **Client**: Vite builds React application to `dist/public`
- **Server**: esbuild bundles Express server to `dist/index.js`
- **Static Assets**: Served from built client directory

### Production Configuration
- **Environment**: Replit autoscale deployment target
- **Port Configuration**: Server runs on port 5000, exposed as port 80
- **Database**: Configured via `DATABASE_URL` environment variable
- **Session Storage**: Falls back to database-backed sessions in production

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment flag for development/production behavior

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Added PostgreSQL database with Neon Database integration
- June 14, 2025. Implemented complete CSS styling and animations according to specification
- June 14, 2025. Replaced memory storage with DatabaseStorage using Drizzle ORM
- June 14, 2025. Complete Welcome screen implementation with specification-accurate design
- June 14, 2025. Enhanced email collection section with glass-morphism design and premium styling
- June 14, 2025. Corrected tower visualization orientation and implemented sophisticated animations
- June 14, 2025. Completed Building Blocks page with Section 5 exact specifications and enhanced animations
- June 14, 2025. Verified stone content data accuracy and assessment algorithm with correct weights [3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0]
- June 15, 2025. Fixed Foundation Stones to Building Blocks navigation using wouter setLocation for proper URL routing
- June 15, 2025. Implemented Color Phase basic structure and CSS following Section 6 specifications with exact 5 color states and distribution mechanics
- June 15, 2025. Created StateCard component and stateOptions data with exact Section 6.2 specifications and proper selection logic
- June 15, 2025. Implemented StateSlider component following Section 6.3 specifications with gradient backgrounds and 100% distribution requirement
- June 15, 2025. Added real-time tower color updates with gradient backgrounds and smooth transitions following exact specifications
- June 15, 2025. Completed Color Phase state management and navigation with ContinueButton component and proper data persistence
- June 15, 2025. Added comprehensive Framer Motion animations to Color Phase with page entrance, state card hover effects, slider appearance, and tower visualization animations
- June 15, 2025. Fixed Color Phase design system integration with glass-morphism effects, Inter font, and proper 2-column grid layout matching Foundation pages
- June 15, 2025. Enhanced Continue button with green gradient styling, shimmer effects, and advanced Framer Motion animations matching design system specifications
- June 15, 2025. Implemented real-time tower color updates with proper distribution slider functionality and enhanced TowerVisualization component for Color Phase
- June 15, 2025. Completed Color Phase final integration with comprehensive data persistence, localStorage saving, and proper navigation to Detail Tokens phase
- June 15, 2025. Applied Foundation Phase CSS structure to Color Phase for consistent glass-morphism design and premium styling matching specification requirements
- June 15, 2025. Copied Foundation stone card styling to state cards with premium glass-morphism effects, proper hover animations, and consistent typography
- June 15, 2025. Added proper navigation container styling to Color Phase matching Foundation/Building pages continue button design
- June 15, 2025. Applied Foundation/Building pages tower visualization styling with professional glass-morphism effects and smooth color transitions
- June 15, 2025. Enhanced slider styling with premium glass-morphism quality, backdrop filters, and refined percentage value displays matching other component standards
- June 15, 2025. Created stateDescriptionsPart1.ts with exact state descriptions for personality types 1-3 from specification document
- June 15, 2025. Created stateDescriptionsPart2.ts with exact state descriptions for personality types 4-6 from specification document
- June 15, 2025. Created stateDescriptionsPart3.ts with exact state descriptions for personality types 7-9 from specification document
- June 15, 2025. Applied container sizing fix with dynamic height for 50-200 word descriptions including proper padding and responsive design adjustments
- June 15, 2025. Integrated personality-specific state descriptions from stateDescriptionsPart1-3.ts files into Color Phase component for Types 1-9 with proper TypeScript typing and fallback handling
- June 15, 2025. Fixed Foundation Stones completion logic to calculate and store personality type using determinePersonalityType algorithm when all 9 stone sets are completed
- June 15, 2025. Removed all "---" dashes from state descriptions across all three state description files (stateDescriptionsPart1-3.ts) to clean up text formatting
- June 15, 2025. Recreated all three state description files with proper content and removed old state content files from attached assets directory
- June 15, 2025. Changed Color Phase section titles "State Selection" and "Your Tower" to dark blue (#1e40af) color and ensured state color indicators display distinct colors per specification