# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

This repository is a template for building React component libraries for Jenesei Software. It uses:

- React 19
- TypeScript 6
- Vite 8 library mode
- Storybook 10 with React/Vite
- Biome for linting and formatting
- `@jenesei-software/jenesei-kit-react` as a peer dependency
- `@jenesei-software/jenesei-plugin-vite` for Storybook-related README/icon generation

The package is intended to publish only the generated `build` directory.

## Important paths

- `src/` — library source code.
- `src/index.ts` — main public entry point.
- `src/components/**/index.ts` — component-level public exports.
- `vite.config.ts` — library build entries, externals, aliases, DTS generation, and Storybook-specific plugins.
- `scripts/generate-exports.mjs` — updates `package.json#exports` from `vite.config.ts` library entries.
- `.storybook/` — Storybook configuration.
- `.storybook-stories/` — Storybook stories.
- `.storybook-public/` — Storybook public assets.
- `build/` — generated package output. Do not edit manually.
- `build-storybook/` — generated Storybook output. Do not edit manually.

## Package manager

Use npm commands. Do not introduce another package manager unless the repository is intentionally migrated.

## Common commands

Run these from the repository root:

```bash
npm run gen:exports
npm run typecheck
npm run typecheck:storybook
npm run biome:lint:check
npm run biome:format:check
npm run build:library
npm run build:storybook
npm run storybook
```

Before finishing a code change, run the smallest relevant validation set. For library source changes, prefer:

```bash
npm run gen:exports
npm run typecheck
npm run biome:lint:check
npm run build:library
```

For Storybook changes, also run:

```bash
npm run typecheck:storybook
npm run build:storybook
```

## TypeScript rules

- Keep TypeScript strict.
- Do not weaken `tsconfig.json` or `tsconfig.build.json` checks to make code pass.
- `tsc` is used for type checking only; emitted files are produced by Vite and `vite-plugin-dts`.
- Prefer explicit exported prop types for public components.
- Public component files should export both the component and its public types through a local `index.ts`.
- Keep declarations publishable: avoid leaking private/internal types through exported APIs unless intentional.

## Imports and aliases

- Use the `@local/*` alias for imports from `src/*`.
- Respect Biome import organization:
  1. `@local/**`
  2. package imports
  3. relative imports
- Do not add deep imports from `build/` or generated Storybook output.
- Keep React imports compatible with the automatic JSX runtime.

## Components

When adding or changing components:

- Place component code under `src/components/<component-name>/`.
- Keep the folder API explicit with an `index.ts` barrel.
- Export public components from `src/index.ts` when they should be part of the root package API.
- Add or update Storybook stories for visible component behavior.
- Keep styling colocated or routed through the library style entry when appropriate.
- Do not add app-only state, routing, or environment assumptions to reusable library components.
- Treat `@jenesei-software/jenesei-kit-react`, `react`, and `react-dom` as peer/runtime externals, not bundled implementation details.

## Library entries and exports

`vite.config.ts` defines library entries. `scripts/generate-exports.mjs` parses those entries and rewrites `package.json#exports`.

When adding a new public subpath entry:

1. Add the entry to `build.lib.entry` in `vite.config.ts`.
2. Ensure the referenced source file exists.
3. Run `npm run gen:exports`.
4. Review the generated `package.json#exports` change.
5. Run `npm run build:library`.

Do not manually edit generated `package.json#exports` unless the export-generation script is also updated accordingly.

## Build output

- Do not manually edit `build/` or `build-storybook/`.
- Do not commit generated output unless the project policy explicitly requires it.
- Keep `build` as the package output because `package.json#files` publishes that directory.
- Keep sourcemap behavior unless there is a deliberate release-policy change.

## Formatting and linting

Biome is the source of truth for formatting and linting.

- Use 2 spaces.
- Use single quotes in JavaScript/TypeScript and JSX.
- Keep line width at 120 characters.
- Do not introduce ESLint or Prettier unless intentionally replacing Biome.
- Prefer `npm run biome:format` for formatting source and stories.

## Storybook

- Storybook runs on port `3030`.
- Storybook build sets `NODE_ENV=storybook`.
- Storybook mode enables the Jenesei Vite plugins for icon generation and README package-doc updates.
- Avoid code that depends on `NODE_ENV=storybook` inside library components unless strictly necessary.

## Dependencies

- Keep `react`, `react-dom`, and `@jenesei-software/jenesei-kit-react` in `peerDependencies` for consumers.
- Do not move peer dependencies into bundled dependencies without a specific reason.
- Avoid adding heavy runtime dependencies to a template library.
- Prefer utilities already available in the project or in Jenesei packages.

## README and package naming

This is a template repository. When adapting it for a real library:

- Replace `library-name` in `package.json` and repository metadata.
- Update `README.md` with the actual library name and usage.
- Keep package exports aligned with actual library entries.

## Safe-change checklist

Before submitting changes, verify:

- Public exports are intentional.
- `npm run gen:exports` has been run after changing Vite library entries.
- Type checks pass for affected areas.
- Biome lint/format checks pass.
- Library build succeeds when source or exports changed.
- Storybook build succeeds when stories or visual component behavior changed.
- Generated folders were not edited manually.
