# Changelog

Все заметные изменения в проекте `wisteria-cli`.

---

### `wisteria-cli@1.1.0` - fix: The global CLI finds pnpm-workspace.yaml in the working directory.

**Дата:** 2026-11-15

- `src/app/utils.ts` - добавлена `findWorkspaceRoot()` для поиска корня монорепо
- `src/cli.ts` - использует поиск от `process.cwd()` вместо `import.meta.url`

---

### `wisteria-cli@1.0.3` - chore: Publish to npm and sync repository.

**Дата:** 2026-11-15

- `dist/**/*` - скомпилированные файлы для публикации
- `package.json` - версия 1.0.3

---

### `wisteria-cli@1.0.2` - feat: Initial CLI implementation.

**Дата:** 2026-11-15

- `src/**/*` - исходный код таск-раннера
- `tests/**/*` - тесты
- `package.json` - конфигурация пакета

---
