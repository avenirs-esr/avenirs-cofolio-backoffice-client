# Avenirs Cofolio Back-office Client

The Avenirs Cofolio Back-office Client is an administration interface for managing platform content and configuration. It initially focuses on two main features:

- **Terms of Service Management**: Create and manage the platform's Terms of Service (CGU).
- **Skills Reference Management**: Manage skills references used within the Avenirs Cofolio ecosystem.

## Project Structure

- `src/`: Source code
  - `assets/`: Static assets
  - `common/`: Shared utilities and cross-cutting concerns
    - `api/`: API services and HTTP client configuration
      - `http.client.ts`: Axios-based HTTP client setup
    - `composables/`: Reusable Vue composition functions
    - `exceptions/`: Error handling infrastructure
    - `types/`: Shared TypeScript types
    - `utils/`: Generic utility functions
  - `components/`: Reusable application components
  - `features/`: Feature modules
    - `skills-references/`: Skills reference management
    - `terms-of-service/`: Terms of Service management
  - `layouts/`: Application layouts
  - `plugins/`: Vue plugins
  - `router/`: Routing configuration
  - `store/`: State management
  - `ui/`: Core UI components
  - `views/`: Main application views

## Project Architecture

The project follows a feature-based architecture with a clear separation of concerns.

### Feature-Based Organization

Each feature module groups the components and logic related to a specific business domain.

```text
features/
├── skills-references/
│   ├── components/       # Feature-specific UI components
│   ├── composables/      # Feature-specific Vue composables
│   ├── layouts/          # Feature-specific layouts, when needed
│   ├── queries/          # Data fetching logic using TanStack Vue Query
│   ├── views/            # Feature page components
│   ├── index.ts          # Module entry point and exports
│   └── routes.ts         # Feature route definitions
└── terms-of-service/
    ├── components/
    ├── composables/
    ├── layouts/
    ├── queries/
    ├── views/
    ├── index.ts
    └── routes.ts
```

This modular approach ensures that:

- Each feature has a clearly defined responsibility.
- Code is organized by business domain rather than technical function alone.
- Features can be developed, tested, and maintained independently.
- Shared code remains separate from feature-specific implementations.

## Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format

# Preview production build
npm run preview

# Build for production
npm run build

# Run all tests (unit)
npm run test

# Run only unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:watch
```

## Local Development with Design System (npm link)

When developing the design system (`@avenirs-esr/avenirs-dsav`) locally alongside this project, use `npm link` to test changes without publishing a new package version.

### Initial Setup

1. In the design system repository (`avenirs-dsav`):

   ```bash
   cd /path/to/avenirs-dsav
   npm install
   npm link
   ```

2. In this project (`avenirs-cofolio-backoffice-client`):

   ```bash
   npm link @avenirs-esr/avenirs-dsav
   ```

### Development Workflow

In the design system repository, run the build in watch mode:

```bash
cd /path/to/avenirs-dsav
npm run build:watch
```

This command runs in parallel:

- `vite build --watch`: Rebuilds the library when source files change.
- `vue-tsc --watch`: Regenerates TypeScript declarations.

Then start the development server in this project:

```bash
npm run dev
```

### Important Notes

- TypeScript configuration excludes the symlinked library's `node_modules` to prevent type conflicts.
- Changes to the design system are reflected in this project as the library rebuilds.
- There is no need to manually rebuild or reinstall the library after each change.

### To Unlink

```bash
npm unlink @avenirs-esr/avenirs-dsav
npm install @avenirs-esr/avenirs-dsav
```

## Features

- Terms of Service management
- Skills reference management

## Tech Stack

- **Frontend Framework**: Vue.js 3
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **API Client**: Axios
- **Data Fetching**: TanStack Vue Query
- **UI Framework**: DSAV (Design System AVENIR(s)) via `@avenirs-esr/avenirs-dsav`
- **Build Tool**: Vite
- **Testing**:
  - Unit Testing: Vitest

## Contributing

### Business Rules

**IMPORTANT**: When a component relies on an important business rule (a non-trivial condition that determines whether an action is allowed or a value must be derived from domain data), that rule **MUST** be extracted into a dedicated `rules` file rather than being inlined in the component.

#### Why?

- Business rules are likely to change and may be reused across components.
- Keeping business logic in components mixes domain logic with presentation concerns.
- Extracted rules are pure functions that are straightforward to unit test in isolation.
- A single source of truth prevents rules from being reimplemented inconsistently.

#### Where Do They Live?

Place rules in a `rules/` folder scoped to the domain they belong to.

For example:

- Shared rules: `src/common/{domain}/rules/{domain}.rules.ts`
- Feature-specific rules: `src/features/{feature}/rules/{feature}.rules.ts`

#### Pattern

Each rule should be an exported, documented pure function that accepts domain data and returns a primitive or derived value.

```typescript
// Example: src/features/terms-of-service/rules/terms-of-service.rules.ts

export function canPublishTermsOfService(
  hasContent: boolean,
  hasRequiredApproval: boolean,
): boolean {
  return hasContent && hasRequiredApproval;
}
```

The example above is illustrative. Adapt the rule and its inputs to the actual business requirements.

Rules must be:

- **Pure**: No side effects, API calls, or store access.
- **Unit tested**: Co-located `*.rules.test.ts` files following the project's BDD testing conventions.

### Stub Files and Barrel Exports

**IMPORTANT**: Stub files (`*.stub.ts`) must **NEVER** be exported from feature barrel files (`index.ts`).

#### Why?

- Stub files are development and testing artifacts.
- Exporting them from barrel files can cause test-only code to be included in production bundles.
- Keeping them separate avoids unnecessary bundle size and dependencies.

#### Correct Pattern

**Do not** export stubs from barrel files:

```typescript
// Avoid
export { ComponentStub } from "./components/Component/Component.stub";
```

**Instead**, import stubs directly in test files:

```typescript
import { ComponentStub } from "./Component.stub";
```

### Commit Conventions

This repository uses [Commitlint](https://commitlint.js.org/) to enforce consistent and conventional commit messages.

The configuration extends `@commitlint/config-conventional` with custom rules.

#### Allowed Commit Types

- `feat` – A new feature
- `fix` – A bug fix
- `docs` – Documentation changes
- `refactor` – Code refactoring
- `test` – Adding or modifying tests
- `build` – Changes to build tools or dependencies
- `revert` – Reverting a previous commit

#### Commit Message Rules

| Rule | Description |
| --- | --- |
| `type-enum` | Only allows the types listed above |
| `type-case` | Commit type must be lowercase |
| `type-empty` | Commit type must not be empty |
| `subject-case` | No restriction on subject casing |

#### Example Commit Messages

```text
feat: add terms of service management
fix: handle invalid skills reference data
docs: update project documentation
```

### ARIA Authoring Practices Guide

When developing components, refer to the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) to support accessible and consistent interactions.

Useful references include:

- [Design Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [Practices](https://www.w3.org/WAI/ARIA/apg/practices/)
