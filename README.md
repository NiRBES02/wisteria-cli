# WisteriaCli

Мощный инструмент для управления монорепозиториями с параллельным запуском скриптов, интерактивной консолью и расширяемой системой команд.

## О проекте

WisteriaCli - это CLI-утилита для работы с монорепозиториями на базе pnpm. Она решает основные проблемы разработки в монорепозиториях: одновременный запуск нескольких сервисов, управление их жизненным циклом, интерактивное управление процессами и расширяемость через систему плагинов.

### Основные возможности

- **Параллельный запуск** - одновременное выполнение скриптов в нескольких пакетах с цветовым кодированием вывода
- **Интерактивная консоль** - управление сервисами в реальном времени (старт, стоп, рестарт, статус)
- **Расширяемые команды** - система регистрации собственных команд с валидацией аргументов
- **Умная фильтрация** - запуск только нужных пакетов по имени или пути с поддержкой wildcard
- **Кроссплатформенность** - корректная работа сигналов на Windows, Linux и macOS
- **Локализация (i18n)** - встроенная поддержка русского и английского языков с правильной плюрализацией
- **Публичный API** - возможность использовать WisteriaCli как библиотеку в своих проектах

## Почему WisteriaCli, а не Turbopack

| Характеристика                   | WisteriaCli                                 | Turbopack                                  |
| -------------------------------- | ------------------------------------------- | ------------------------------------------ |
| **Фокус**                        | Управление процессами в монорепозитории     | Сборка (bundling)                          |
| **Запуск сервисов**              | Параллельный с управлением жизненным циклом | Не предназначен для долгоживущих процессов |
| **Интерактивность**              | Встроенная REPL-консоль                     | Нет                                        |
| **Расширяемость**                | Система команд, middleware, хуки            | Ограничена конфигурацией                   |
| **Управление сигналами**         | Кроссплатформенное дерево процессов         | Базовое                                    |
| **Локализация**                  | Встроенная i18n с плюрализацией             | Нет                                        |
| **Типизация**                    | Строгий TypeScript, брендированные типы     | Базовая                                    |
| **Использование как библиотека** | Публичный API с фабрикой createWisteria     | Только CLI                                 |

WisteriaCli не конкурирует с Turbopack - это инструменты для разных задач. Turbopack отлично подходит для сборки, WisteriaCli - для оркестрации запуска сервисов в разработке.

## Быстрый старт

### Установка

```bash
# Глобально
pnpm add -g wisteria-cli

# Или локально в проекте
pnpm add -D wisteria-cli
```

### Инициализация в существующем монорепозитории

Создайте `pnpm-workspace.yaml` в корне монорепозитория и добавьте скрипт в `package.json`:

```bash
cd your-monorepo

# Создайте pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
  - 'apps/*'
EOF

# Добавьте скрипт в package.json корня
cat >> package.json << 'EOF'
{
  "scripts": {
    "wisteria": "wisteria"
  }
}
EOF
```

### Запуск разработки

```bash
# Запуск скрипта dev во всех пакетах (dev - по умолчанию)
wisteria

# Запуск только в конкретных пакетах
wisteria --filter=@myorg/frontend --filter=@myorg/backend

# Запуск с кастомным скриптом
wisteria --script=start

# Режим сухого запуска (показать что будет выполнено)
wisteria --dry-run
```

## Классификация команд

### Основная команда CLI

У WisteriaCli одна точка входа - команда `wisteria`, которая запускает указанный npm-скрипт в выбранных пакетах:

```bash
# Запуск скрипта dev (по умолчанию)
wisteria

# Запуск любого скрипта через --script
wisteria --script=build
wisteria --script=test
wisteria --script=start:prod

# С фильтрацией пакетов
wisteria --script=dev --filter=@myorg/frontend
```

### Интерактивные команды (доступны внутри консоли после запуска wisteria)

После запуска `wisteria` (или `wisteria --script=dev`) открывается интерактивная консоль:

- `help` - список доступных команд
- `status` - статус запущенных сервисов
- `services` - псевдоним для status
- `start <package>` - запуск остановленного сервиса
- `stop [package]` - остановка сервиса или всех сервисов
- `restart [package]` - перезапуск сервиса или всех
- `run <package> <command> [args...]` - выполнение произвольной команды в пакете
- `install <package...>` - установка зависимостей в указанных пакетах

## Основные опции раннера

### Фильтрация пакетов

```bash
# По имени пакета
wisteria --script=dev --filter=@myorg/frontend

# По относительному пути
wisteria --script=dev --filter=packages/frontend

# Wildcard (все пакеты в директории)
wisteria --script=dev --filter=packages/*

# Исключение пакетов
wisteria --script=dev --filter=!@myorg/docs

# Комбинация
wisteria --script=dev --filter=@myorg/* --filter=!@myorg/docs
```

### Дополнительные аргументы

```bash
# Передача аргументов скрипту (после --)
wisteria --script=dev -- --port=3000 --verbose

# Кастомный скрипт (вместо dev)
wisteria --script=start:prod

# Выбор локали
wisteria --script=dev --locale=en-US
# или переменная окружения
WISTERIA_LOCALE=en-US wisteria --script=dev

# Сухой запуск (показать что будет выполнено)
wisteria --script=dev --dry-run
```

## Локализация (i18n)

WisteriaCli имеет встроенную систему интернационализации с поддержкой двух языков:

- **ru-RU** - русский (язык по умолчанию, источник правды)
- **en-US** - английский

### Особенности реализации

- **Типизированные ключи** - использование template literal types для автодополнения ключей перевода
- **Плюрализация** - поддержка правил CLDR:
  - Русский: one (1), few (2-4), many (5+)
  - Английский: one (1), other (0, 2+)
- **Интерполяция** - подстановка параметров через `{placeholder}`
- **Ленивая загрузка** - локали загружаются при первом обращении
- **Цепочка фолбэков** - текущая локаль -> ru-RU -> ключ

### Переключение языка

```bash
# CLI флаг
wisteria dev --locale=en-US

# Переменная окружения
export WISTERIA_LOCALE=en-US
wisteria dev
```

### Использование в коде

```typescript
import { t, setLocale, getLocale } from 'wisteria-cli/i18n';

// Простой перевод
console.log(t('orchestrator.started', { count: 3, script: 'dev' }));

// С плюрализацией (автоматически выбирает правильную форму)
console.log(t('plural.package', { count: 5 })); // "5 пакетов" или "5 packages"

// Смена локали
await setLocale('en-US');
console.log(getLocale()); // 'en-US'
```

### Структура ключей перевода

```
banner.project          // "Проект" / "Project"
banner.version          // "Версия" / "Version"
orchestrator.started    // "Запущено {count} пакет(ов)..." / "Started {count} package(s)..."
orchestrator.noPackagesMatched
signals.stopping
commandConsole.statusDescription
commandConsole.installDescription
service.installationFailed
supervisor.serviceNotRunning
arguments.unknownOption
// ... и многие другие
```

## Создание собственного монорепозитория с WisteriaCli

### 1. Инициализация структуры

```bash
mkdir my-monorepo
cd my-monorepo

# Инициализация pnpm workspace
pnpm init

# Создание pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
  - 'apps/*'
EOF
```

### 2. Установка WisteriaCli

```bash
pnpm add -D wisteria-cli
```

### 3. Создание пакетов

```bash
# Приложение frontend
mkdir -p apps/frontend
cat > apps/frontend/package.json << 'EOF'
{
  "name": "@myorg/frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}
EOF

# Приложение backend
mkdir -p apps/backend
cat > apps/backend/package.json << 'EOF'
{
  "name": "@myorg/backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "fastify": "^4.0.0"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Общая библиотека
mkdir -p packages/shared
cat > packages/shared/package.json << 'EOF'
{
  "name": "@myorg/shared",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
EOF
```

### 4. Установка зависимостей

```bash
# Установка во всех пакетах
wisteria install @myorg/frontend @myorg/backend @myorg/shared

# Или через интерактивную консоль
wisteria dev
# В консоли: install @myorg/frontend @myorg/backend @myorg/shared
```

### 5. Запуск разработки

```bash
# Запуск всех приложений
wisteria dev

# Только frontend и backend
wisteria dev --filter=@myorg/frontend --filter=@myorg/backend

# С передачей аргументов
wisteria dev -- --port=3000
```

### 6. Работа в интерактивной консоли

После запуска `wisteria dev` откроется интерактивная консоль:

```
wisteria> help
wisteria> status
wisteria> stop @myorg/frontend
wisteria> start @myorg/frontend
wisteria> restart @myorg/backend
wisteria> run @myorg/shared test
```

## Использование как библиотеки (Public API)

```typescript
import { createWisteria, AppOrchestrator, ServiceSupervisor } from 'wisteria-cli';

// Фабрика для быстрого старта
const wisteria = createWisteria({
  rootDir: '/path/to/monorepo',
  locale: 'ru-RU',
});

// Запуск с опциями раннера
await wisteria.run({
  script: 'dev',
  filters: ['@myorg/*'],
  scriptArguments: ['--port=3000'],
  dryRun: false,
});

// Или прямое использование классов
const orchestrator = new AppOrchestrator('/path/to/monorepo');
await orchestrator.run({
  script: 'dev',
  filters: [],
});
```

## Расширение через кастомные команды

Создайте файл `wisteria-commands.ts` в корне проекта:

```typescript
import { CommandRegistry } from 'wisteria-cli';
import type { CommandContext } from 'wisteria-cli';
import { t } from 'wisteria-cli/i18n';

export function registerCustomCommands(registry: CommandRegistry, context: CommandContext): void {
  registry.register('deploy', 'Deploy to production', async (_args, ctx) => {
    const packages = ctx.packages.filter(p => p.name.startsWith('@myorg/'));
    for (const pkg of packages) {
      ctx.write(`Deploying ${pkg.name}...`);
      await ctx.run(pkg, 'pnpm', ['run', 'deploy']);
    }
  });

  registry.register('logs', 'Show recent logs', (_args, ctx) => {
    for (const service of ctx.services) {
      ctx.write(`${service.package.name}: PID ${service.pid}`);
    }
  });
}
```

Затем подключите в точке входа:

```typescript
import { registerCustomCommands } from './wisteria-commands';
import { createWisteria } from 'wisteria-cli';

const wisteria = createWisteria({ rootDir: process.cwd() });
wisteria.registry.registerCustomCommands = registerCustomCommands;
```

## Конфигурация TypeScript

Проект использует строгий режим TypeScript:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "verbatimModuleSyntax": true
  }
}
```

Это гарантирует безопасность типов во всем коде.

## Линтинг и форматирование

```bash
# Проверка типов
pnpm typecheck

# Линтинг
pnpm lint

# Форматирование
pnpm format

# Проверка форматирования
pnpm format:check
```

## Структура проекта

```
src/
├── cli.ts               # Точка входа CLI
├── app/                 # Основная логика приложения
│   ├── orchestrator.ts  # Координация запуска пакетов
│   ├── banner.ts        # Вывод баннера
│   ├── colors.ts        # Цветовая схема пакетов
│   ├── signals.ts       # Обработка сигналов ОС
│   └── utils.ts         # Утилиты чтения манифестов
├── cli/                 # CLI слой
│   ├── logger.ts        # Логгер с префиксами пакетов
│   ├── text-parser.ts   # Парсинг вывода процессов
│   ├── terminal-interface.ts # Работа с TTY
│   └── argument-parser.ts  # Парсинг командной строки
├── commands/            # Система команд
│   ├── command-registry.ts   # Реестр команд
│   ├── command-console.ts    # Интерактивная консоль
│   ├── custom-commands.ts    # Пользовательские команды
│   └── types.ts              # Типы команд
├── i18n/                # Интернационализация
│   ├── index.ts         # Публичный API
│   ├── registry.ts      # Загрузка и кэш локалей
│   ├── types.ts         # Типы i18n
│   └── locales/         # Файлы локалей
│       ├── ru-RU.ts
│       ├── en-US.ts
│       └── index.ts
├── process/             # Управление процессами
│   ├── launcher.ts      # Запуск команд
│   ├── service.ts       # Управление сервисами
│   ├── process-tree.ts  # Дерево процессов
│   └── output-pipe.ts   # Пайпинг вывода
├── runner/              # Раннер
│   ├── arguments.ts     # Парсинг аргументов
│   ├── discovery.ts     # Обнаружение пакетов
│   ├── supervisor.ts    # Супервизор сервисов
│   ├── service-process.ts # Экспорт процессных утилит
│   └── types.ts         # Типы раннера
└── public-api.ts        # Публичный API
```

## Установка из исходного кода GitHub

Для использования последней версии из репозитория или конкретной ветки/коммита без публикации в npm:

```bash
# Установка с главной ветки
pnpm add github:NiRBES02/wisteria-cli

# Установка конкретной ветки
pnpm add github:NiRBES02/wisteria-cli#develop

# Установка конкретного коммита
pnpm add github:NiRBES02/wisteria-cli#abc1234

# Установка с тега
pnpm add github:NiRBES02/wisteria-cli#v1.2.3
```

Для использования в монорепозитории с pnpm workspace добавьте в package.json корня:

```json
{
  "dependencies": {
    "wisteria-cli": "github:NiRBES02/wisteria-cli#develop"
  }
}
```

После установки выполните `pnpm install` - pnpm автоматически соберёт проект из исходников.

### Разработка с локальной копией

Если вы хотите вносить изменения в WisteriaCli и сразу видеть их в своём проекте:

```bash
# Клонируйте репозиторий
git clone https://github.com/NiRBES02/wisteria-cli.git
cd wisteria-cli

# Установите зависимости и соберите
pnpm install
pnpm build

# В вашем проекте подключите локальную копию через file: протокол
cd /path/to/your-project
pnpm add /path/to/wisteria-cli
```

Или используйте `pnpm link` для создания симлинка:

```bash
# В папке wisteria-cli
pnpm link --global

# В вашем проекте
pnpm link --global wisteria-cli
```

## Требования

- Node.js >= 20.0.0
- pnpm >= 9.0.0 (как менеджер пакетов монорепозитория)

## Лицензия

MIT
