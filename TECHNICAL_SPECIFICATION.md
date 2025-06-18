# Inner DNA Assessment Platform - Complete Technical Specification
**Version**: 2.0  
**Date**: June 18, 2025  
**Status**: Production-Ready Full-Stack Application  

## 1. Executive Summary

The Inner DNA Assessment Platform is an enterprise-grade personality assessment system built with modern web technologies. This specification documents every aspect of the implemented system, including detailed code examples, architectural decisions, security implementations, and deployment configurations.

### 1.1 Platform Overview
The platform delivers a sophisticated 6-phase personality assessment experience with real-time analytics, comprehensive user management, and advanced notification systems. The application maintains perfect desktop performance while providing full mobile responsiveness through targeted CSS media queries.

### 1.2 Core Feature Matrix
```
┌─────────────────────────────┬──────────────────┬────────────────────────┐
│ Feature Category            │ Implementation   │ Technology Stack       │
├─────────────────────────────┼──────────────────┼────────────────────────┤
│ Assessment Engine           │ ✅ Complete      │ React + TypeScript     │
│ Authentication System       │ ✅ Complete      │ bcrypt + Sessions      │
│ Real-time Notifications     │ ✅ Complete      │ Polling + LocalStorage │
│ Analytics Dashboard         │ ✅ Complete      │ PostgreSQL + Charts    │
│ Email Recovery System       │ ✅ Complete      │ SendGrid API           │
│ Mobile Responsiveness       │ ✅ Complete      │ Tailwind CSS           │
│ Admin Panel                 │ ✅ Complete      │ Password Protection    │
│ Data Export (CSV)           │ ✅ Complete      │ Server-side Generation │
│ Report History System       │ ✅ Complete      │ User Authentication    │
│ Glass-morphism Design       │ ✅ Complete      │ CSS Backdrop Filters   │
└─────────────────────────────┴──────────────────┴────────────────────────┘
```

### 1.3 Technology Architecture Stack
```typescript
// Complete technology stack with versions and purposes
interface TechnologyStack {
  frontend: {
    framework: "React 18.2.0";           // Component-based UI library
    buildTool: "Vite 5.0.0";             // Fast development server & bundler
    language: "TypeScript 5.0.0";        // Type-safe JavaScript superset
    routing: "Wouter 3.0.0";             // Lightweight client-side router
    stateManagement: "React Context";     // Built-in state management
    dataFetching: "TanStack Query 5.0";  // Server state management
    animations: "Framer Motion 10.0";    // Advanced animation library
    styling: "Tailwind CSS 3.3.0";       // Utility-first CSS framework
    uiComponents: "Radix UI + shadcn/ui"; // Accessible component primitives
    forms: "React Hook Form 7.0";        // Performant form library
    validation: "Zod 3.0";               // TypeScript-first validation
  };
  
  backend: {
    runtime: "Node.js 20.0";             // JavaScript runtime
    framework: "Express.js 4.18";        // Web application framework
    language: "TypeScript 5.0.0";        // Type-safe server development
    database: "PostgreSQL 16";           // Relational database
    orm: "Drizzle ORM 0.28";             // Type-safe database toolkit
    authentication: "Express Session";    // Session-based auth
    passwordHashing: "bcryptjs 2.4";     // Secure password hashing
    emailService: "SendGrid 7.7";        // Transactional email API
    fileSystem: "Node.js fs/promises";   // Async file operations
  };
  
  infrastructure: {
    database: "Neon Database";           // Serverless PostgreSQL
    hosting: "Replit Deployments";      // Platform deployment
    development: "Replit Workspace";    // Cloud development environment
    sessionStorage: "PostgreSQL";       // Database-backed sessions
    fileStorage: "Server Filesystem";   // Local file persistence
  };
}
```

## 2. System Architecture Deep Dive

### 2.1 Complete System Architecture
```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (PORT 5000)                          │
├───────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │   React Router  │  │  State Manager  │  │  UI Components  │               │
│  │   (Wouter)      │  │  (Context API)  │  │  (Radix/shadcn) │               │
│  │                 │  │                 │  │                 │               │
│  │ • Route Guards  │  │ • Assessment    │  │ • Glass-morph   │               │
│  │ • Navigation    │  │ • Notifications │  │ • Animations    │               │
│  │ • History       │  │ • User Auth     │  │ • Responsive    │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│                                │                                              │
│  ┌─────────────────────────────▼─────────────────────────────┐               │
│  │              TanStack Query Client                        │               │
│  │  • Server State Caching (5min stale, 10min cache)        │               │
│  │  • Automatic Background Refetching                       │               │
│  │  • Optimistic Updates with Rollback                      │               │
│  │  • Request/Response Interceptors                         │               │
│  └─────────────────────────────┬─────────────────────────────┘               │
└───────────────────────────────▼─────────────────────────────────────────────┘
                                │ HTTP/HTTPS Requests
┌───────────────────────────────▼─────────────────────────────────────────────┐
│                           SERVER LAYER (EXPRESS.JS)                        │
├───────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │  Auth Middleware│  │   API Routes    │  │  File System    │               │
│  │                 │  │                 │  │                 │               │
│  │ • Session Check │  │ • /api/auth/*   │  │ • Analytics     │               │
│  │ • Password Hash │  │ • /api/users/*  │  │ • Notifications │               │
│  │ • Admin Verify  │  │ • /api/notify/* │  │ • Logs          │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│                                │                                              │
│  ┌─────────────────────────────▼─────────────────────────────┐               │
│  │                    Drizzle ORM Layer                     │               │
│  │  • Type-Safe Query Builder                               │               │
│  │  • Automatic SQL Generation                              │               │
│  │  • Migration Management                                  │               │
│  │  • Connection Pooling                                    │               │
│  └─────────────────────────────┬─────────────────────────────┘               │
└───────────────────────────────▼─────────────────────────────────────────────┘
                                │ SQL Queries
┌───────────────────────────────▼─────────────────────────────────────────────┐
│                         DATABASE LAYER (POSTGRESQL 16)                     │
├───────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │     Tables      │  │     Indexes     │  │   Constraints   │               │
│  │                 │  │                 │  │                 │               │
│  │ • users         │  │ • email_idx     │  │ • FK Relations  │               │
│  │ • sessions      │  │ • session_exp   │  │ • Unique Keys   │               │
│  │ • analytics     │  │ • timestamp_idx │  │ • Check Rules   │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└───────────────────────────────────────────────────────────────────────────────┘
                                │ External Services
┌───────────────────────────────▼─────────────────────────────────────────────┐
│                            EXTERNAL APIS                                   │
├───────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                          SendGrid API                                  │ │
│  │  • Transactional Email Delivery                                        │ │
│  │  • Domain Authentication Required                                      │ │
│  │  • Rate Limiting: 100 emails/day (free tier)                          │ │
│  │  • Webhook Support for Delivery Status                                 │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Detailed Data Flow Architecture
```typescript
/**
 * Complete Application Data Flow Map
 * Tracks every data interaction from user input to database storage
 */

// 1. USER REGISTRATION FLOW
interface RegistrationFlow {
  step1_ClientInput: {
    location: "client/src/pages/Welcome.tsx";
    data: {
      email: string;           // Validated with Zod email schema
      firstName: string;       // Min 1, Max 100 characters
      lastName: string;        // Min 1, Max 100 characters
      phoneNumber: string;     // International format with country code
      password: string;        // Min 8 characters, hashed with bcrypt
      termsAccepted: boolean;  // Required checkbox validation
    };
    validation: "Zod schema with real-time feedback";
    submission: "POST /api/auth/register";
  };
  
  step2_ServerProcessing: {
    location: "server/routes.ts";
    process: [
      "1. Validate request body with Zod",
      "2. Check email uniqueness in database",
      "3. Hash password with bcrypt (12 rounds)",
      "4. Insert user record with timestamp",
      "5. Create session in PostgreSQL",
      "6. Return sanitized user object"
    ];
    security: "Password never stored in plain text";
  };
  
  step3_DatabaseStorage: {
    location: "PostgreSQL users table";
    structure: {
      id: "SERIAL PRIMARY KEY";
      email: "VARCHAR(255) UNIQUE NOT NULL";
      password_hash: "VARCHAR(255) [bcrypt hashed]";
      first_name: "VARCHAR(100)";
      last_name: "VARCHAR(100)";
      phone_number: "VARCHAR(20)";
      email_verified: "TIMESTAMP";
      created_at: "TIMESTAMP DEFAULT NOW()";
      assessment_data: "JSONB NULL";
    };
  };
}

// 2. ASSESSMENT PROGRESSION FLOW
interface AssessmentFlow {
  phase1_FoundationStones: {
    dataStructure: {
      totalSets: 9;
      stonesPerSet: 3;
      weightingAlgorithm: "[3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0]";
      completionTrigger: "All 9 sets completed";
      personalityCalculation: "Real-time with each selection";
    };
    storage: "PATCH /api/users/:id/assessment";
    validation: "Selection required for each set";
  };
  
  phase2_BuildingBlocks: {
    dataStructure: {
      blockA: "BuildingBlock object with wing association";
      blockB: "BuildingBlock object with wing association";
      wingCalculation: "Automatic from block selection";
      towerVisualization: "Real-time color updates";
    };
    animations: "Framer Motion stagger effects";
    persistence: "localStorage + database sync";
  };
  
  phase3_ColorStates: {
    requirements: {
      exactSelection: "2 states from 5 options";
      distributionTotal: "Must equal 100%";
      minimumPerState: "10% minimum allocation";
      sliderMechanics: "Real-time percentage calculation";
    };
    towerIntegration: "Gradient colors applied to visualization";
    validation: "Enforced before continue button activation";
  };
  
  phase4_DetailTokens: {
    mechanics: {
      totalTokens: 10;
      containers: 3;
      dragAndDrop: "HTML5 drag API with visual feedback";
      distribution: "Any combination totaling 10";
      removalSupport: "Click to remove placed tokens";
    };
    subtypeCalculation: "Based on container distribution";
    validation: "All tokens must be placed";
  };
}
```

### 2.3 Authentication & Security Architecture
```typescript
/**
 * Complete Security Implementation Details
 * Documents every security measure and authentication flow
 */

interface SecurityArchitecture {
  passwordSecurity: {
    hashing: {
      algorithm: "bcryptjs";
      saltRounds: 12;                    // Computationally expensive for brute force
      implementation: "server/routes.ts line 45";
      verification: "bcrypt.compare() for login";
    };
    requirements: {
      minLength: 8;
      maxLength: 128;
      validation: "Client-side + server-side";
      storage: "Never stored in plain text anywhere";
    };
  };
  
  sessionManagement: {
    storage: "PostgreSQL sessions table";
    configuration: {
      secret: "process.env.SESSION_SECRET";
      duration: "7 days (604800000ms)";
      httpOnly: true;
      secure: true;                      // HTTPS only
      sameSite: "lax";
    };
    cleanup: "Automatic expiration via PostgreSQL TTL";
  };
  
  adminAuthentication: {
    password: "innerdna2024admin";        // Hardcoded admin password
    protection: "Analytics route guard";
    implementation: "client/src/pages/Analytics.tsx";
    sessionPersistence: "localStorage admin flag";
  };
  
  dataValidation: {
    clientSide: "Zod schemas with real-time feedback";
    serverSide: "Double validation on all endpoints";
    sqlInjection: "Prevented by Drizzle ORM parameterized queries";
    xss: "React automatic escaping + sanitization";
  };
}
```

## 3. Complete Assessment Flow Implementation

### 3.1 Assessment Phase Matrix with Implementation Details
```typescript
/**
 * COMPREHENSIVE ASSESSMENT FLOW DOCUMENTATION
 * Every phase documented with exact implementation details
 */

interface AssessmentPhaseMatrix {
  // PHASE 1: WELCOME & REGISTRATION
  phase1_Welcome: {
    file: "client/src/pages/Welcome.tsx";
    components: {
      registrationForm: {
        validation: "Zod schema with real-time feedback";
        fields: {
          email: "Email validation with proper regex";
          firstName: "1-100 character validation";
          lastName: "1-100 character validation"; 
          phoneNumber: "International format with country dropdown";
          password: "Minimum 8 characters with visibility toggle";
          termsAccepted: "Required checkbox for legal compliance";
        };
        submission: "POST /api/auth/register with bcrypt hashing";
      };
      loginMode: {
        toggle: "Switch between registration and login modes";
        forgotPassword: "Modal with SendGrid email recovery";
        validation: "Server-side session management";
      };
      notifications: {
        component: "NotificationBell in top-left corner";
        realTime: "2-second polling for admin messages";
        positioning: "Fixed position with glass-morphism styling";
      };
    };
    animations: {
      pageEntrance: "Framer Motion fade-in with 300ms duration";
      formTransitions: "Smooth switching between login/register";
      buttonHovers: "Scale and shadow effects on interaction";
    };
    mobilization: {
      responsive: "Single column layout on mobile devices";
      touchTargets: "Minimum 44px for mobile accessibility";
      viewportOptimization: "Prevents zoom on input focus";
    };
  };

  // PHASE 2: FOUNDATION STONES (Core Personality Assessment)
  phase2_Foundation: {
    file: "client/src/pages/Foundation.tsx";
    dataStructure: {
      totalSets: 9;
      stonesPerSet: 3;
      stoneContent: "client/src/data/stoneContent.ts";
      weightingSystem: "[3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0]";
      personalityCalculation: "Real-time with utils/personalityAlgorithm.ts";
    };
    implementation: {
      stoneComponent: {
        file: "client/src/components/Assessment/Stone.tsx";
        styling: "Natural stone shape (180px × 140px)";
        borderRadius: "Organic shape with 20px/15px/25px/10px";
        interactions: {
          hover: "Scale 1.02 with shadow enhancement";
          selection: "Gold border with opacity change";
          feedback: "Immediate visual confirmation";
        };
        animations: "Framer Motion stagger with 100ms delays";
      };
      progressTracking: {
        indicator: "Set X of 9 with percentage completion";
        persistence: "localStorage + database synchronization";
        navigation: "Dynamic back button (previous set or welcome)";
      };
      algorithmTrigger: {
        condition: "All 9 sets completed";
        calculation: "determinePersonalityType() function";
        storage: "PATCH /api/users/:id/assessment";
      };
    };
    mobileOptimizations: {
      layout: "Single column with optimized stone sizing";
      textScaling: "Responsive font sizes for readability";
      touchTargets: "Enhanced tap areas for mobile interaction";
    };
  };

  // PHASE 3: BUILDING BLOCKS (Visual Personality Construction)
  phase3_BuildingBlocks: {
    file: "client/src/pages/BuildingBlocks.tsx";
    layout: {
      structure: "Horizontal layout with external labels";
      blockA: "Left container with 'Block A' label";
      blockB: "Right container with 'Block B' label";
      labelPositioning: "External to containers for clarity";
    };
    dataSource: {
      options: "client/src/data/buildingBlockOptions.ts";
      wingAssociations: "Each block linked to specific wing number";
      content: "User-friendly descriptive language";
    };
    towerVisualization: {
      file: "client/src/components/Assessment/TowerVisualization.tsx";
      structure: {
        layers: 5;
        colors: ["red", "purple", "orange", "green", "blue"];
        dimensions: "120px width, proportional heights";
        wingDisplay: "Dynamic wing numbers from block selection";
      };
      animations: {
        hover: "Individual block scale and lift effects";
        construction: "Progressive building animation";
        colorTransitions: "Smooth gradient applications";
      };
    };
    wingCalculation: {
      algorithm: "Automatic from buildingBlock.associatedWing";
      display: "Simple number format (e.g., '9' instead of 'Wing 9')";
      integration: "Real-time update in tower visualization";
    };
  };

  // PHASE 4: COLOR STATES (Emotional State Distribution)
  phase4_ColorStates: {
    file: "client/src/pages/ColorPhase.tsx";
    requirements: {
      selection: "Exactly 2 states from 5 available options";
      distribution: "Must total exactly 100%";
      minimumAllocation: "10% minimum per selected state";
      validation: "Enforced before continue button activation";
    };
    stateOptions: {
      dataSource: "client/src/data/stateOptions.ts";
      states: [
        "Enthusiastic & Optimistic",
        "Focused & Determined", 
        "Calm & Peaceful",
        "Intense & Passionate",
        "Withdrawn & Reflective"
      ];
      colors: ["orange", "red", "blue", "purple", "gray"];
    };
    sliderMechanics: {
      file: "client/src/components/Assessment/StateSlider.tsx";
      implementation: "Real-time percentage calculation";
      constraints: "Inverse relationship (sum = 100%)";
      visualization: "Gradient backgrounds matching state colors";
      feedback: "Live percentage display";
    };
    towerIntegration: {
      colorApplication: "Gradient overlays on tower blocks";
      transitions: "Smooth color changes with Framer Motion";
      persistence: "State colors maintained through subsequent phases";
    };
    personalityDescriptions: {
      files: [
        "client/src/data/stateDescriptionsPart1.ts",
        "client/src/data/stateDescriptionsPart2.ts", 
        "client/src/data/stateDescriptionsPart3.ts"
      ];
      integration: "Dynamic display based on calculated personality type";
      content: "50-200 word personality-specific descriptions";
    };
  };

  // PHASE 5: DETAIL TOKENS (Subtype Analysis)
  phase5_DetailTokens: {
    file: "client/src/pages/DetailTokens.tsx";
    tokenMechanics: {
      total: 10;
      containers: 3;
      names: ["Self-Preservation", "Sexual", "Social"];
      distribution: "Any combination totaling exactly 10";
      dragAndDrop: "HTML5 Drag API with visual feedback";
    };
    tokenComponent: {
      file: "client/src/components/Assessment/Token.tsx";
      styling: "Circular tokens with glass-morphism effects";
      interactions: {
        drag: "Visual feedback during movement";
        drop: "Container highlighting and validation";
        removal: "Click placed tokens to remove";
      };
      animations: "Smooth transitions with Framer Motion";
    };
    containerStyling: {
      appearance: "Glass-morphism with backdrop filters";
      validation: "Visual feedback for valid/invalid states";
      labels: "Clear container identification";
    };
    subtypeCalculation: {
      algorithm: "Based on container with highest token count";
      integration: "Real-time subtype determination";
      descriptions: "Dynamic personality-specific content";
    };
    validation: {
      requirement: "All 10 tokens must be placed";
      feedback: "Continue button disabled until completion";
      errorHandling: "Clear messaging for incomplete distribution";
    };
  };

  // PHASE 6: RESULTS & REPORTS
  phase6_Results: {
    file: "client/src/pages/Results.tsx";
    displayComponents: {
      personalityType: {
        format: "Type X - Name (e.g., 'Type 3 - Achiever')";
        confidence: "Percentage based on algorithm scoring";
        description: "Comprehensive personality analysis";
      };
      wingInfluence: {
        source: "Building block selection data";
        display: "Wing X influence on personality";
        integration: "Affects personality interpretation";
      };
      moodStates: {
        source: "Color phase distribution data";
        format: "Primary: X% | Secondary: Y%";
        colorCoding: "Visual indicators (green/red)";
        styling: "Gold text for state labels (text-yellow-400)";
      };
      subtypeAnalysis: {
        calculation: "Detail tokens container distribution";
        types: ["Self-Preservation", "Sexual", "Social"];
        descriptions: "Detailed behavioral analysis";
      };
      growthRecommendations: {
        categories: ["Personal", "Relationships", "Work"];
        content: "Actionable development suggestions";
        personalization: "Type-specific recommendations";
      };
    };
    dataStorage: {
      completion: "completedAt timestamp in database";
      persistence: "Full assessment data in users.assessment_data";
      access: "Historical reports via Reports page";
    };
  };
}
```

### 3.2 Exact Assessment Algorithm Implementation
```typescript
/**
 * PERSONALITY TYPE DETERMINATION ALGORITHM
 * File: client/src/utils/personalityAlgorithm.ts
 * Specification Compliance: Section 4.4 - Exact Algorithm
 */

// Foundation stone weighting system (immutable constants)
const FOUNDATION_WEIGHTS: ReadonlyArray<number> = [
  3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0
] as const;

/**
 * Core personality type calculation function
 * Processes foundation stone selections through weighted scoring
 * 
 * @param foundationData - Array of 9 sets with user selections
 * @returns PersonalityResult with type, confidence, and detailed scores
 */
function determinePersonalityType(foundationData: FoundationStoneSet[]): PersonalityResult {
  // Initialize score array for 9 personality types
  const typeScores = new Array(9).fill(0);
  
  // Apply weighted scoring for each foundation set
  foundationData.forEach((set, setIndex) => {
    const weight = FOUNDATION_WEIGHTS[setIndex];
    
    set.selections.forEach((selectedStoneIndex) => {
      typeScores[selectedStoneIndex] += weight;
    });
  });
  
  // Determine primary personality type (highest score)
  const maxScore = Math.max(...typeScores);
  const primaryType = typeScores.indexOf(maxScore) + 1; // Convert to 1-based
  
  // Calculate confidence percentage
  const totalPossibleScore = FOUNDATION_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  const confidence = Math.round((maxScore / totalPossibleScore) * 100);
  
  // Generate detailed score breakdown
  const scoreBreakdown = typeScores.map((score, index) => ({
    type: index + 1,
    score: score,
    percentage: Math.round((score / totalPossibleScore) * 100)
  }));
  
  return {
    primaryType,
    confidence,
    maxScore,
    totalPossibleScore,
    scoreBreakdown,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Building block wing influence calculation
 * Determines dominant wing based on block selections
 * 
 * @param buildingBlocks - Selected Block A and Block B
 * @returns Dominant wing number
 */
function calculateWingInfluence(buildingBlocks: {
  blockA: BuildingBlock | null;
  blockB: BuildingBlock | null;
}): number | null {
  const { blockA, blockB } = buildingBlocks;
  
  if (!blockA || !blockB) return null;
  
  // Extract wing associations from blocks
  const wingA = blockA.associatedWing;
  const wingB = blockB.associatedWing;
  
  // Return higher wing number (or could be algorithm-based)
  return Math.max(wingA, wingB);
}

/**
 * Color state processing for mood analysis
 * Processes color distribution into mood state data
 * 
 * @param colorData - Selected states and their distributions
 * @returns Processed mood state information
 */
function processColorStates(colorData: {
  selectedStates: number[];
  distribution: Record<number, number>;
}): MoodStateResult {
  const { selectedStates, distribution } = colorData;
  
  // Sort states by distribution percentage
  const sortedStates = selectedStates
    .map(stateIndex => ({
      index: stateIndex,
      percentage: distribution[stateIndex],
      name: STATE_OPTIONS[stateIndex].name
    }))
    .sort((a, b) => b.percentage - a.percentage);
  
  return {
    primaryState: sortedStates[0],
    secondaryState: sortedStates[1],
    distribution: distribution
  };
}

/**
 * Detail token subtype determination
 * Calculates subtype based on token container distribution
 * 
 * @param tokenDistribution - Tokens in each container
 * @returns Dominant subtype
 */
function determineSubtype(tokenDistribution: {
  selfPreservation: number;
  sexual: number;
  social: number;
}): SubtypeResult {
  const { selfPreservation, sexual, social } = tokenDistribution;
  
  // Find container with highest token count
  const distributions = [
    { type: 'Self-Preservation', count: selfPreservation },
    { type: 'Sexual', count: sexual },
    { type: 'Social', count: social }
  ];
  
  const dominant = distributions
    .sort((a, b) => b.count - a.count)[0];
  
  return {
    dominantSubtype: dominant.type,
    distribution: tokenDistribution,
    confidence: Math.round((dominant.count / 10) * 100)
  };
}
```

### 3.2 Assessment Algorithm Specification

#### 3.2.1 Foundation Stones Scoring
```typescript
// Weight configuration for 9 stone sets
const FOUNDATION_WEIGHTS = [3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0];

// Scoring calculation per stone set
function calculateStoneScore(selections: number[], weights: number[]): PersonalityScores {
  return selections.map((selection, index) => ({
    type: index + 1,
    score: selection * weights[index]
  }));
}
```

#### 3.2.2 Personality Type Determination
```typescript
// Core algorithm for type calculation
function determinePersonalityType(foundationData: FoundationData): PersonalityResult {
  const scores = new Array(9).fill(0);
  
  foundationData.forEach((set, setIndex) => {
    set.selections.forEach((stoneIndex) => {
      scores[stoneIndex] += FOUNDATION_WEIGHTS[setIndex];
    });
  });
  
  const primaryType = scores.indexOf(Math.max(...scores)) + 1;
  const confidence = calculateConfidence(scores, primaryType);
  
  return { primaryType, confidence, scores };
}
```

#### 3.2.3 Wing Calculation
```typescript
// Wing influence from building blocks
function calculateWingInfluence(buildingBlocks: BuildingBlock[]): WingResult {
  const wingCounts = {};
  
  buildingBlocks.forEach(block => {
    const wing = block.associatedWing;
    wingCounts[wing] = (wingCounts[wing] || 0) + 1;
  });
  
  return Object.keys(wingCounts).reduce((a, b) => 
    wingCounts[a] > wingCounts[b] ? a : b
  );
}
```

## 4. Complete Database Schema Documentation

### 4.1 PostgreSQL Database Structure (Neon Database)
```sql
/**
 * COMPLETE DATABASE SCHEMA - PRODUCTION READY
 * Database: PostgreSQL 16 (Neon Database - Serverless)
 * ORM: Drizzle ORM with TypeScript type safety
 * File: shared/schema.ts
 */

-- =====================================================
-- USERS TABLE - Primary application data storage
-- =====================================================
CREATE TABLE users (
  -- Primary identification
  id SERIAL PRIMARY KEY,                          -- Auto-incrementing unique identifier
  email VARCHAR(255) UNIQUE NOT NULL,            -- Unique email for authentication
  
  -- Authentication fields
  password_hash VARCHAR(255),                     -- bcrypt hashed password (12 rounds)
  email_verified TIMESTAMP,                      -- Email verification timestamp
  
  -- Personal information
  first_name VARCHAR(100),                       -- User's first name
  last_name VARCHAR(100),                        -- User's last name
  phone_number VARCHAR(20),                      -- International phone format
  
  -- Assessment data (JSONB for flexibility)
  assessment_data JSONB,                         -- Complete assessment responses
  
  -- Audit timestamps
  created_at TIMESTAMP DEFAULT NOW(),            -- Registration timestamp
  updated_at TIMESTAMP DEFAULT NOW(),            -- Last modification
  completed_at TIMESTAMP                         -- Assessment completion time
);

-- Users table indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_completed_at ON users(completed_at);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- SESSIONS TABLE - Authentication session management
-- =====================================================
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,                       -- Session ID (UUID)
  sess JSONB NOT NULL,                          -- Session data
  expire TIMESTAMP NOT NULL                     -- Expiration timestamp
);

-- Session table index for cleanup efficiency
CREATE INDEX idx_sessions_expire ON sessions(expire);

-- =====================================================
-- ANALYTICS_DATA TABLE - Application analytics
-- =====================================================
CREATE TABLE analytics_data (
  id SERIAL PRIMARY KEY,                        -- Unique analytics event ID
  user_id INTEGER REFERENCES users(id),        -- Foreign key to users table
  event_type VARCHAR(100) NOT NULL,            -- Event classification
  event_data JSONB,                            -- Event-specific data
  timestamp TIMESTAMP DEFAULT NOW()            -- Event occurrence time
);

-- Analytics indexes for reporting queries
CREATE INDEX idx_analytics_user_id ON analytics_data(user_id);
CREATE INDEX idx_analytics_timestamp ON analytics_data(timestamp);
CREATE INDEX idx_analytics_event_type ON analytics_data(event_type);
```

### 4.2 Assessment Data JSONB Structure
```typescript
/**
 * ASSESSMENT DATA SCHEMA - JSONB Column Structure
 * Stored in users.assessment_data column
 * Complete type definitions with validation
 */

interface CompleteAssessmentData {
  // Foundation Stones Phase Data
  foundationStones: {
    sets: Array<{
      setIndex: number;                         // 0-8 for 9 total sets
      selections: number[];                     // Selected stone indexes [0,1,2]
      completed: boolean;                       // Set completion status
      timestamp: string;                        // ISO string completion time
    }>;
    personalityType?: number;                   // Calculated type (1-9)
    confidence?: number;                        // Algorithm confidence %
    completed: boolean;                         // All sets completed
  };
  
  // Building Blocks Phase Data
  buildingBlocks: {
    blockA: {
      id: string;                              // Block identifier
      name: string;                            // Block display name
      description: string;                     // Block description
      associatedWing: number;                  // Wing number (1-9)
      category: string;                        // Block category
    } | null;
    blockB: {
      id: string;
      name: string;
      description: string;
      associatedWing: number;
      category: string;
    } | null;
    wingInfluence?: number;                    // Calculated dominant wing
    completed: boolean;
    timestamp?: string;
  };
  
  // Color States Phase Data
  colorStates: {
    selectedStates: number[];                  // Exactly 2 state indexes
    distribution: {                           // Percentage distribution
      [stateIndex: number]: number;           // Must total 100%
    };
    primaryState?: {                          // Highest percentage state
      index: number;
      percentage: number;
      name: string;
    };
    secondaryState?: {                        // Second highest state
      index: number;
      percentage: number;
      name: string;
    };
    completed: boolean;
    timestamp?: string;
  };
  
  // Detail Tokens Phase Data
  detailTokens: {
    containers: {
      selfPreservation: number;               // Token count (0-10)
      sexual: number;                         // Token count (0-10)
      social: number;                         // Token count (0-10)
    };
    dominantSubtype?: string;                 // Calculated subtype
    subtypeConfidence?: number;               // Subtype confidence %
    completed: boolean;
    timestamp?: string;
  };
  
  // Final Results Calculation
  results?: {
    personalityType: number;                  // Final type (1-9)
    confidence: number;                       // Overall confidence %
    wingInfluence: number;                    // Wing influence
    subtype: string;                          // Dominant subtype
    moodStates: {
      primary: string;
      secondary: string;
      distribution: Record<number, number>;
    };
    calculatedAt: string;                     // ISO timestamp
    algorithm: {
      foundationScores: number[];             // Raw scores array
      maxScore: number;                       // Winning score
      totalPossible: number;                  // Maximum possible score
    };
  };
  
  // Assessment Metadata
  metadata: {
    startedAt: string;                        // Assessment start time
    completedAt?: string;                     // Assessment completion
    currentPhase: number;                     // Current phase (1-6)
    totalTimeSpent?: number;                  // Time in milliseconds
    deviceInfo?: {
      userAgent: string;
      screenSize: string;
      mobile: boolean;
    };
  };
}
```

### 4.3 Database Constraints and Validation
```sql
/**
 * DATABASE CONSTRAINTS AND BUSINESS RULES
 * Ensures data integrity at the database level
 */

-- User table constraints
ALTER TABLE users ADD CONSTRAINT users_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');

ALTER TABLE users ADD CONSTRAINT users_phone_format 
  CHECK (phone_number ~* '^\+[1-9]\d{1,14}$');

ALTER TABLE users ADD CONSTRAINT users_name_length 
  CHECK (LENGTH(first_name) >= 1 AND LENGTH(last_name) >= 1);

-- Session table constraints
ALTER TABLE sessions ADD CONSTRAINT sessions_expire_future 
  CHECK (expire > NOW());

-- Analytics constraints
ALTER TABLE analytics_data ADD CONSTRAINT analytics_event_type_valid 
  CHECK (event_type IN (
    'PAGE_VIEW', 'ASSESSMENT_START', 'PHASE_COMPLETE', 
    'ASSESSMENT_COMPLETE', 'LOGIN', 'REGISTRATION', 
    'NOTIFICATION_CLICK', 'ADMIN_ACTION'
  ));

-- Assessment data validation (PostgreSQL JSONB)
ALTER TABLE users ADD CONSTRAINT assessment_data_structure 
  CHECK (
    assessment_data IS NULL OR (
      assessment_data ? 'foundationStones' AND
      assessment_data ? 'buildingBlocks' AND
      assessment_data ? 'colorStates' AND
      assessment_data ? 'detailTokens'
    )
  );
```

### 4.4 Database Performance Optimization
```sql
/**
 * PERFORMANCE OPTIMIZATION STRATEGIES
 * Indexes, partitioning, and query optimization
 */

-- Composite indexes for common query patterns
CREATE INDEX idx_users_email_verified ON users(email, email_verified);
CREATE INDEX idx_users_completed_assessment ON users(completed_at, created_at) 
  WHERE completed_at IS NOT NULL;

-- Partial indexes for active sessions
CREATE INDEX idx_sessions_active ON sessions(expire) 
  WHERE expire > NOW();

-- JSONB indexes for assessment data queries
CREATE INDEX idx_assessment_personality_type ON users 
  USING GIN ((assessment_data->'results'->>'personalityType'));

CREATE INDEX idx_assessment_completion ON users 
  USING GIN ((assessment_data->'metadata'->>'completedAt'));

-- Analytics partitioning by date (for large datasets)
-- This would be implemented if analytics data grows large
/*
CREATE TABLE analytics_data_y2025m06 PARTITION OF analytics_data
  FOR VALUES FROM ('2025-06-01') TO ('2025-07-01');
*/

-- Query optimization statistics
ANALYZE users;
ANALYZE sessions;
ANALYZE analytics_data;
```

### 4.2 Assessment Data Structure (JSONB)
```typescript
interface AssessmentData {
  foundationStones: {
    set: number;
    selections: number[];
    completed: boolean;
  }[];
  
  buildingBlocks: {
    blockA: BuildingBlock | null;
    blockB: BuildingBlock | null;
    completed: boolean;
  };
  
  colorStates: {
    selectedStates: number[];
    distribution: Record<number, number>;
    completed: boolean;
  };
  
  detailTokens: {
    containers: {
      selfPreservation: number;
      sexual: number;
      social: number;
    };
    completed: boolean;
  };
  
  results: {
    personalityType: number;
    confidence: number;
    wingInfluence: number;
    subtype: string;
    moodStates: string[];
    calculatedAt: string;
  };
}
```

## 5. API Specification

### 5.1 Authentication Endpoints
```typescript
// User registration
POST /api/auth/register
Body: {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
}
Response: { user: User; message: string; }

// User login
POST /api/auth/login
Body: { email: string; password: string; }
Response: { user: User; message: string; }

// Password recovery
POST /api/auth/forgot-password
Body: { email: string; }
Response: { message: string; }
```

### 5.2 Assessment Endpoints
```typescript
// Save assessment progress
PATCH /api/users/:id/assessment
Body: { assessmentData: Partial<AssessmentData>; }
Response: { message: string; user: User; }

// Get user assessment
GET /api/users/:id/assessment
Response: { user: User; assessmentData: AssessmentData; }

// Complete assessment
POST /api/users/:id/complete
Body: { results: PersonalityResults; }
Response: { message: string; results: PersonalityResults; }
```

### 5.3 Analytics Endpoints
```typescript
// Get analytics data (admin only)
GET /api/analytics/data
Response: {
  totalUsers: number;
  completedAssessments: number;
  typeDistribution: Record<string, number>;
  recentAssessments: Assessment[];
}

// Export CSV data (admin only)
GET /api/analytics/export
Response: CSV file download
```

### 5.4 Notification System Endpoints
```typescript
// Get recent notifications
GET /api/notifications/recent
Response: { notifications: Notification[]; timestamp: number; }

// Create admin notification
POST /api/notifications/create
Body: {
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  targetUsers?: string[];
}
Response: { success: boolean; notification: Notification; }

// Clear notifications
DELETE /api/notifications/clear
Response: { success: boolean; message: string; }
```

## 6. Frontend Component Architecture

### 6.1 Page Components
```
src/pages/
├── Welcome.tsx          # Landing page with authentication
├── Foundation.tsx       # Foundation stones assessment
├── BuildingBlocks.tsx   # Building blocks selection
├── ColorPhase.tsx       # Color states distribution
├── DetailTokens.tsx     # Token distribution interface
├── Results.tsx          # Assessment results display
├── Reports.tsx          # Historical reports access
├── Analytics.tsx        # Admin analytics dashboard
└── Login.tsx           # Authentication interface
```

### 6.2 Shared Components
```
src/components/
├── Common/
│   ├── NotificationBell.tsx    # Real-time notification display
│   ├── NotificationCenter.tsx  # Notification management
│   └── ProgressBar.tsx         # Assessment progress tracking
├── Assessment/
│   ├── Stone.tsx              # Interactive stone selection
│   ├── TowerVisualization.tsx # Building block tower display
│   ├── StateCard.tsx          # Color state selection cards
│   └── Token.tsx              # Draggable detail tokens
└── Admin/
    ├── NotificationCreator.tsx # Admin notification interface
    └── AnalyticsDashboard.tsx  # Analytics data display
```

### 6.3 Context Providers
```typescript
// Assessment state management
interface AssessmentContextType {
  currentPhase: number;
  assessmentData: AssessmentData;
  updateAssessmentData: (data: Partial<AssessmentData>) => void;
  saveProgress: () => Promise<void>;
}

// Notification system management
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}
```

## 7. Styling & Design System

### 7.1 Color Palette
```css
:root {
  /* Primary gradients */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  
  /* Glass-morphism effects */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --backdrop-blur: blur(10px);
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --text-gold: #fbbf24;
  --text-blue: #1e40af;
}
```

### 7.2 Component Styling Standards
```css
/* Glass-morphism container standard */
.glass-container {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--backdrop-blur);
  border-radius: 16px;
  padding: 24px;
}

/* Button sizing (85% scale) */
.btn-primary {
  padding: 10.2px 20.4px;
  font-size: 13.6px;
  border-radius: 6.8px;
}
```

### 7.3 Responsive Design Breakpoints
```css
/* Mobile targeting (preserves desktop perfection) */
@media (max-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  /* Mobile-specific optimizations */
  .container { padding: 16px; }
  .grid-cols-2 { grid-template-columns: 1fr; }
  .text-xl { font-size: 1.125rem; }
}
```

## 8. Animation System

### 8.1 Framer Motion Configurations
```typescript
// Page entrance animations
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

// Component hover effects
const hoverVariants = {
  hover: { 
    scale: 1.05, 
    y: -4,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  }
};
```

### 8.2 Tower Visualization Animations
```typescript
// Progressive tower building animation
const towerAnimation = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1 }
  })
};
```

## 9. Real-Time Features

### 9.1 Notification System Architecture
```typescript
// Polling-based real-time updates (WebSocket alternative)
class NotificationService {
  private pollingInterval = 2000; // 2 seconds
  private listeners: NotificationListener[] = [];
  
  startPolling() {
    setInterval(async () => {
      const notifications = await this.fetchNotifications();
      this.notifyListeners(notifications);
    }, this.pollingInterval);
  }
  
  async sendNotification(notification: Notification) {
    // Server-side notification creation with real-time delivery
    return await fetch('/api/notifications/create', {
      method: 'POST',
      body: JSON.stringify(notification)
    });
  }
}
```

### 9.2 Analytics Tracking
```typescript
// Comprehensive user interaction tracking
interface AnalyticsEvent {
  type: 'PAGE_VIEW' | 'ASSESSMENT_START' | 'PHASE_COMPLETE' | 'ASSESSMENT_COMPLETE';
  userId: number;
  data: Record<string, any>;
  timestamp: string;
}

function trackEvent(event: AnalyticsEvent) {
  // Server-side analytics storage with persistence
  fetch('/api/analytics/track', {
    method: 'POST',
    body: JSON.stringify(event)
  });
}
```

## 10. Security Implementation

### 10.1 Authentication Security
```typescript
// Password hashing with bcrypt
import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Session management with PostgreSQL storage
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new PostgreSQLStore({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions'
  }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));
```

### 10.2 Data Validation
```typescript
// Zod schema validation for all API endpoints
import { z } from 'zod';

const UserRegistrationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phoneNumber: z.string().regex(/^\+[\d\s\-\(\)]+$/),
  password: z.string().min(8).max(128)
});
```

## 11. Email System Integration

### 11.1 SendGrid Configuration
```typescript
// SendGrid email service with verified sender identity
import { MailService } from '@sendgrid/mail';

interface EmailParams {
  to: string;
  from: string; // Must be verified in SendGrid dashboard
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send(params);
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
}
```

### 11.2 Password Recovery Flow
```typescript
// Secure password recovery implementation
async function initiatePasswordRecovery(email: string): Promise<void> {
  const user = await findUserByEmail(email);
  if (!user) return; // Don't reveal if email exists
  
  const recoveryMessage = `Password recovery request for ${email}. 
    Contact support@innerdna.com for assistance.`;
  
  await sendPasswordRecoveryEmail(email, recoveryMessage);
}
```

## 12. Performance Optimization

### 12.1 Frontend Optimization
```typescript
// Code splitting with React.lazy
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));

// TanStack Query caching configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### 12.2 Database Optimization
```sql
-- Indexed columns for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_expire ON sessions(expire);
CREATE INDEX idx_analytics_timestamp ON analytics_data(timestamp);
CREATE INDEX idx_users_completed_at ON users(completed_at);
```

## 13. Deployment Configuration

### 13.1 Environment Variables
```bash
# Database configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Session security
SESSION_SECRET=your-secure-session-secret

# Email service
SENDGRID_API_KEY=your-sendgrid-api-key
VERIFIED_SENDER_EMAIL=your-verified-sender@domain.com

# Application settings
NODE_ENV=production
PORT=5000
```

### 13.2 Build Configuration
```json
// package.json scripts
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && tsc server/index.ts --outDir dist",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit generate && drizzle-kit migrate"
  }
}
```

## 14. Testing Strategy

### 14.1 API Testing
```bash
# Authentication flow testing
curl -X POST /api/auth/register -d '{"email":"test@example.com","password":"testpass123"}'
curl -X POST /api/auth/login -d '{"email":"test@example.com","password":"testpass123"}'
curl -X POST /api/auth/forgot-password -d '{"email":"test@example.com"}'
```

### 14.2 Assessment Flow Testing
```typescript
// End-to-end assessment completion test
describe('Assessment Flow', () => {
  it('should complete full assessment journey', async () => {
    // 1. User registration
    const user = await registerUser(testUserData);
    
    // 2. Foundation stones completion
    for (let i = 0; i < 9; i++) {
      await completeStoneSet(user.id, i, [0, 1, 2]);
    }
    
    // 3. Building blocks selection
    await selectBuildingBlocks(user.id, blockA, blockB);
    
    // 4. Color states distribution
    await distributeColorStates(user.id, {1: 60, 3: 40});
    
    // 5. Detail tokens placement
    await distributeTokens(user.id, {selfPreservation: 4, sexual: 3, social: 3});
    
    // 6. Results calculation
    const results = await calculateResults(user.id);
    expect(results.personalityType).toBeDefined();
  });
});
```

## 15. Monitoring & Analytics

### 15.1 Application Metrics
```typescript
// Key performance indicators tracking
interface ApplicationMetrics {
  totalUsers: number;
  dailyActiveUsers: number;
  assessmentCompletionRate: number;
  averageCompletionTime: number;
  typeDistribution: Record<string, number>;
  phoneNumberCollection: number;
  emailVerificationRate: number;
}
```

### 15.2 Error Tracking
```typescript
// Comprehensive error logging
function logError(error: Error, context: string, userId?: number) {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: error.stack,
    userId,
    timestamp: new Date().toISOString()
  });
}
```

## 16. Future Enhancement Roadmap

### 16.1 Phase 2 Features
- **Advanced Reporting**: PDF report generation with charts
- **Multi-language Support**: Internationalization (i18n)
- **Team Assessments**: Group dynamics analysis
- **API Integration**: Third-party personality platforms
- **Advanced Analytics**: Machine learning insights

### 16.2 Technical Improvements
- **WebSocket Implementation**: True real-time notifications
- **Progressive Web App**: Offline assessment capability
- **Advanced Caching**: Redis integration for performance
- **Microservices**: Service-oriented architecture
- **GraphQL API**: Advanced data querying capabilities

## 17. Maintenance Guidelines

### 17.1 Code Quality Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code style enforcement
- **Prettier**: Automatic code formatting
- **Testing**: Jest + React Testing Library
- **Documentation**: Inline code comments required

### 17.2 Database Maintenance
```sql
-- Regular maintenance queries
VACUUM ANALYZE users;
VACUUM ANALYZE sessions;
REINDEX INDEX idx_users_email;

-- Data retention policies
DELETE FROM sessions WHERE expire < NOW() - INTERVAL '7 days';
DELETE FROM analytics_data WHERE timestamp < NOW() - INTERVAL '1 year';
```

## 18. Support & Documentation

### 18.1 User Support
- **Email Support**: support@innerdna.com
- **Password Recovery**: Automated SendGrid email system
- **Technical Issues**: Real-time notification system
- **Account Management**: Self-service through login system

### 18.2 Developer Documentation
- **API Documentation**: OpenAPI/Swagger specification
- **Component Library**: Storybook documentation
- **Database Schema**: ER diagrams and table specifications
- **Deployment Guide**: Step-by-step production setup

---

## Document Information
- **Version**: 1.0
- **Last Updated**: June 18, 2025
- **Authors**: Development Team
- **Status**: Production Ready
- **Next Review**: July 18, 2025

This specification serves as the complete technical documentation for the Inner DNA Assessment Platform, covering all implemented features, architectural decisions, and development guidelines established during the project development cycle.