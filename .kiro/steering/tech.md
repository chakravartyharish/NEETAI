# Technology Stack & Build System

## Core Technologies
- **Framework**: Next.js 15 (App Router, Edge Runtime, Server Components)
- **Language**: TypeScript 5.2+ (strict mode enabled)
- **Styling**: Tailwind CSS v4 + Radix UI + Framer Motion
- **Database**: Supabase (PostgreSQL 15 + Auth + Realtime + Storage)
- **Monorepo**: Turborepo with npm workspaces
- **Mobile**: React Native 0.74 + Expo SDK 51
- **State Management**: Zustand + TanStack Query v5
- **Forms**: React Hook Form + Zod validation

## AI & External Services
- **Primary AI**: OpenAI GPT-4o-2024-11-20
- **Voice AI**: OpenAI Whisper-v3 + ElevenLabs Pro
- **Vision AI**: GPT-4o Vision + Google Vision API
- **Vector DB**: Pinecone for semantic search
- **Payments**: Stripe with UPI support
- **Cache**: Vercel KV (Redis)
- **Search**: Typesense

## Package Manager & Dependencies
- **Package Manager**: npm (v10.8.2+)
- **Node Version**: 18+ required
- **Workspace Structure**: Uses npm workspaces for monorepo management
- **Internal Packages**: Prefixed with `@neet/` (e.g., `@neet/ui`, `@neet/auth`)

## Common Commands

### Development
```bash
# Install all dependencies
npm install

# Start all apps in development mode
npm run dev

# Start specific app only
npm run dev --filter=web
npm run dev --filter=admin

# Type checking across all packages
npm run check-types

# Lint all packages
npm run lint

# Format code with Prettier
npm run format
```

### Build & Deploy
```bash
# Build all apps and packages
npm run build

# Build specific app
npm run build --filter=web

# Generate Supabase types
npm run db:generate

# Run database migrations
npm run db:migrate
```

### Package Management
```bash
# Add dependency to specific workspace
npm install package-name -w apps/web
npm install package-name -w packages/ui

# Add dev dependency to root
npm install -D package-name
```

## Build Configuration

### Turborepo Pipeline
- **Build**: Packages build in dependency order with caching
- **Lint**: Parallel linting across all packages
- **Type Check**: TypeScript validation for all packages
- **Dev**: Persistent development servers with hot reload

### TypeScript Configuration
- **Strict Mode**: Enabled across all packages
- **No Implicit Any**: Enforced
- **Explicit Return Types**: Required for all functions
- **Shared Configs**: Base configs in `packages/typescript-config/`

### ESLint Configuration
- **Shared Rules**: Base config in `packages/eslint-config/`
- **Turbo Plugin**: Validates environment variables
- **TypeScript Rules**: Strict TypeScript linting
- **Prettier Integration**: Automatic code formatting

## Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Vercel Services
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

## Performance Targets
- **API Latency**: <100ms (95th percentile)
- **Page Load**: <1.5s (First Contentful Paint)
- **Bundle Size**: Monitored and optimized
- **Concurrent Users**: 100,000+ support target
