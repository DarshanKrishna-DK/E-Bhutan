# Digital Bhutan Platform

## Overview

Digital Bhutan is a comprehensive digital-first nation platform designed to connect citizens, businesses, and government services through blockchain integration, gamification, and modern web technologies. The platform features NFT-based digital identity, a cultural learning system with brownie points, job portals, marketplace functionality, and mini-apps ecosystem.

## System Architecture

The application follows a full-stack TypeScript architecture with clear separation between client and server components:

- **Frontend**: React with TypeScript using Vite for build tooling
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Bhutanese color palette
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Blockchain Integration**: Mock NFT system (designed for Avalanche C-Chain)

## Key Components

### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon serverless database with WebSocket support
- **Schema**: Comprehensive database schema covering users, residency applications, businesses, jobs, products, cultural activities, and mini-apps
- **Type Safety**: Full TypeScript integration with Zod validation schemas

### Authentication & Identity
- **Digital Identity**: NFT-based soulbound tokens for residents and businesses
- **User Management**: Email/password authentication with bcrypt hashing
- **Residency System**: Multi-tier digital residency with application workflow
- **Business Registration**: Separate business entity system with licensing

### Gamification System
- **Brownie Points**: ERC-20 style token system for cultural engagement
- **Tier Levels**: 5-tier progression system (Dragon Egg to Celestial Dragon)
- **Cultural Activities**: Quiz system and learning modules
- **Rewards**: Tier-based benefits and marketplace discounts

### Core Modules
1. **G2C (Government to Citizen)**: Residency applications, digital identity, cultural learning
2. **G2B (Government to Business)**: Business registration, licensing, job posting
3. **B2C (Business to Citizen)**: Job portal, marketplace, mini-apps
4. **Marketplace**: Product listings with brownie points rewards
5. **Mini-Apps**: Telegram-style sandboxed applications

## Data Flow

1. **User Registration**: Creates user account and initiates residency application
2. **Identity Verification**: Mock NFT minting for approved residents/businesses
3. **Cultural Engagement**: Users complete activities to earn brownie points
4. **Tier Progression**: Points accumulation leads to tier advancement and benefits
5. **Economic Activity**: Marketplace transactions and job applications using platform currency
6. **Mini-App Ecosystem**: Third-party applications integrated through iframe sandboxing

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+ with TypeScript, react-dom, react-hook-form
- **Backend**: Express.js, Node.js with ES modules
- **Database**: @neondatabase/serverless, drizzle-orm, drizzle-kit
- **Authentication**: bcrypt for password hashing
- **Validation**: Zod for runtime type checking

### UI and Styling
- **Component Library**: Complete shadcn/ui component set with Radix UI primitives
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx, tailwind-merge for conditional styling

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Code Quality**: TypeScript strict mode with comprehensive type checking

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR and proxy setup
- **Database**: Neon serverless PostgreSQL with development environment
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite production build with optimized bundles
- **Backend**: esbuild compilation to ESM format for Node.js
- **Database**: Drizzle migrations with push strategy for schema updates
- **Deployment**: Express server serving static assets and API routes

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **Build Process**: Separate client and server build processes
- **Static Assets**: Client build output served by Express in production

## Changelog

- June 28, 2025. Initial setup with basic Digital Bhutan platform framework
- June 28, 2025. Enhanced cultural design with Buddhist monuments and traditional architectural elements
- June 28, 2025. **MAJOR UPDATE**: Completed comprehensive Avalanche blockchain integration with real smart contracts, NFT minting, Soulbound tokens, NuBuck digital currency, Mini-App Store sandbox, multi-language support (English/Dzongkha), payment gateways, government service modules, and advanced gamification system

## Recent Changes

- ✓ Real Avalanche Blockchain Integration: Implemented complete smart contract system with NFT minting, Soulbound tokens, and NuBuck digital currency on Avalanche C-Chain
- ✓ Advanced Mini-App Store: Built secure sandbox execution environment with iframe isolation, blockchain verification, and real-time resource monitoring
- ✓ Multi-Language Support: Added comprehensive English/Dzongkha internationalization with 1000+ translated phrases and automatic language detection
- ✓ Payment Gateway Integration: Implemented Stripe payment processing for NuBuck purchases with real cryptocurrency handling and wallet management
- ✓ Government Service Module: Created comprehensive blockchain-verified government services with NFT credentials and smart contract automation
- ✓ Advanced Gamification: Built on-chain verification system for cultural rewards with blockchain-backed Brownie Points and tier progression
- ✓ Wallet Integration: Developed complete MetaMask integration with transaction history, balance tracking, and cross-chain functionality
- ✓ Buddhist Background Integration: Enhanced cultural authenticity with traditional Buddhist architectural elements across all pages

## User Preferences

Preferred communication style: Simple, everyday language.
Cultural Requirements: Traditional Bhutanese design elements with Buddhist monuments and transparent background structures for enhanced cultural authenticity.