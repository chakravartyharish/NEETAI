# Project Structure & Organization

## Monorepo Architecture

```
neet-prep-platform/
├── apps/                    # Applications
│   ├── web/                # Main Next.jt app (port 3001)
│   ├── admin/              # Admin dashboard
│   └── coach/              # Coach portal (planned)
├── packages/               # Shared packages
│   ├── ui/                 # Design system & components
│   ├── database/           # Supabase client & types
│   ├── auth/               # Authentication logic
│   ├── ai/                 # AI services & prompts
│   ├── analytics/          # Tracking & metrics
│   ├── config/             # Shared configurations
│   ├── utils/              # Common utilities
│   └── types/              # Shared TypeScript types
├── docs/                   # Documentation
├── supabase/               # Database migrations & config
└── .bmad-core/             # BMAD agent system files
```

## Application Structure (Next.js Apps)

### Web App (`apps/web/`)
```
apps/web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify-email/
│   ├── api/               # API routes
│   │   └── auth/          # Auth endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
└── package.json           # App dependencies
```

## Package Structure

### UI Package (`packages/ui/`)
```
packages/ui/
├── src/
│   ├── components/        # React components
│   ├── utils/            # UI utilities (cn helper)
│   └── styles.css        # Base styles
├── dist/                 # Built output
└── package.json          # Component library config
```

### Database Package (`packages/database/`)
```
packages/database/
├── schema/               # SQL schema files
├── client.ts            # Supabase client setup
├── types.ts             # Generated types
└── index.ts             # Main exports
```

### Auth Package (`packages/auth/`)
```
packages/auth/
├── hooks/               # React hooks (useAuth)
├── providers/           # Auth context providers
├── types/               # Auth-related types
├── utils/               # Auth utilities
└── index.ts             # Main exports
```

## Naming Conventions

### Files & Folders
- **Components**: PascalCase (`QuizEngine.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Folders**: kebab-case (`auth-forms/`)
- **API Routes**: kebab-case (`reset-password/`)

### Package Naming
- **Internal Packages**: `@neet/package-name`
- **Shared Configs**: `@repo/config-name`
- **Scoped Imports**: Use workspace aliases

## File Organization Rules

### Component Colocation
```
components/
├── quiz-engine/
│   ├── QuizEngine.tsx      # Main component
│   ├── QuizEngine.test.tsx # Tests
│   ├── quiz-engine.css     # Styles (if needed)
│   └── index.ts            # Barrel export
```

### Feature-Based Structure
- Group by feature, not file type
- Keep related files together
- Use barrel exports (`index.ts`) for clean imports

### API Route Organization
```
app/api/
├── auth/
│   ├── signin/route.ts
│   ├── signup/route.ts
│   └── session/route.ts
├── quiz/
└── analytics/
```

## Import Conventions

### Package Imports
```typescript
// Internal packages
import { Button } from '@neet/ui'
import { useAuth } from '@neet/auth'
import { supabase } from '@neet/database'

// External packages
import { NextRequest } from 'next/server'
import { z } from 'zod'
```

### Relative Imports
- Use relative imports within the same package
- Avoid deep relative imports (`../../../`)
- Prefer barrel exports for cleaner imports

## Configuration Files

### Root Level
- `turbo.json` - Turborepo pipeline configuration
- `package.json` - Root workspace configuration
- `.env.example` - Environment variable template

### App Level
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules

### Package Level
- `package.json` - Package dependencies & exports
- `tsconfig.json` - Package-specific TypeScript config

## Development Workflow

### Adding New Features
1. Create feature branch: `feature/quiz-engine`
2. Add components to appropriate package
3. Export through barrel files
4. Update package.json exports if needed
5. Add tests and documentation

### Adding New Packages
1. Create in `packages/` directory
2. Add to workspace in root `package.json`
3. Configure exports in package `package.json`
4. Add TypeScript configuration
5. Update Turborepo pipeline if needed

## Build Outputs

### Package Builds
- `packages/ui/dist/` - Built UI components
- `packages/*/dist/` - Other package builds

### App Builds
- `apps/web/.next/` - Next.js build output
- `apps/admin/.next/` - Admin build output

### Cache
- `.turbo/cache/` - Turborepo build cache
- `node_modules/.cache/` - Various tool caches
