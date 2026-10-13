# Scripts Documentation

## generate-feature.mjs

Generates a new sub-feature structure following the project's feature-based architecture.

### Usage

```bash
npm run generate:feature <feature>
```

### Arguments

- `feature` (required): Must be a valid string representing the feature name (e.g., `terms-of-service`, `skill-references`)

### Example

```bash
npm run generate:feature terms-of-service
```

### Generated Structure

The script creates the following structure:

```
src/features/{feature}/
├── components/           # Feature-specific UI components
├── composables/          # Feature-specific composables
├── queries/              # TanStack Query hooks
├── routes/
│   └── index.ts          # Route definitions (empty array export)
├── stores/               # Feature-specific Pinia stores
├── types/                # Feature-specific TypeScript types
├── views/                # Feature page components
├── locales/
│   ├── en.json           # English translations
│   └── fr.json           # French translations
└── index.ts              # Barrel file (public API)
```

### Generated Files Content

**locales/en.json & locales/fr.json:**
```json
{
  "feature": {}
}
```

**routes/index.ts:**
```typescript
export default []
```

**index.ts (barrel file):**
```typescript
export default {}
```

### Next Steps After Generation

1. Add your components to `components/` folder
2. Define routes in `routes/index.ts`
3. Add translations to `locales/en.json` and `locales/fr.json`
4. Export public API elements in `index.ts` (components, queries, routes, stores, types)

### Error Handling

The script will exit with an error if:
- Required argument is missing
- Feature already exists at the target location
