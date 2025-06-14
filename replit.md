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