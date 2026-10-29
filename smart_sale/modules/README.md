# Feature modules

Each business feature keeps its own code together:

```
modules/<feature>/
  api/         HTTP calls for the feature (axios / callApi)
  hooks/       React Query hooks built on api/
  types/       TypeScript types for the feature's data
  config/      DynamicForm field definitions
  components/  Screens and widgets used only by this feature
```

- Route files in `app/` stay thin: they import the screen from `modules/<feature>/components` and export it.
- Import files directly (`@/modules/metal/hooks/useMetals`). There are no `index.ts` barrels, so imports never pull in a whole module or create cycles.
- Inside a module use relative imports (`../api/metalApi`). Modules may import shared code (`components/`, `component/`, `utils/`, `theme/`) but not each other's `components/`.
- Code used by several features stays outside `modules/`: UI in `components/primitives` and `component/`, formatting in `utils/format`.
- When a file moves here, the old path keeps a one-line re-export marked `@deprecated` so existing imports keep working. Remove it once nothing imports it.

Migrated so far: `metal`, `rate`.
