/**
 * Russian locale (source of truth).
 * All translation keys are defined here first, then translated to other locales.
 * This file is the authoritative source for all translation keys and structure.
 * Other locales (e.g., en-US) must maintain the same key structure.
 */
export default {
  // Banner
  banner: {
    project: 'Проект',
    version: 'Версия',
  },

  // Signals
  signals: {
    stopping: 'Остановка пакетов рабочего пространства ({signal})...',
  },

  // Orchestrator
  orchestrator: {
    noPackagesMatched:
      'Ни один пакет рабочего пространства не соответствует запрошенным фильтрам и скрипту "{script}".',
    started: 'Запущено {count} пакет(ов) со скриптом "{script}".',
  },

  // Process tree
  processTree: {
    couldNotSendSignal: 'Не удалось отправить {signal} дереву процессов {pid}: {error}',
    couldNotTerminateTaskkill:
      '[{packageName}] Не удалось завершить дерево процессов (taskkill exit code {exitCode}).',
    couldNotTerminate: '[{packageName}] Не удалось завершить дерево процессов: {error}',
  },

  // Launcher
  launcher: {
    emptyScript: 'Нельзя запустить пустой скрипт пакета: "{script}".',
    packageMissingScript: 'Пакет "{packageName}" не определяет скрипт "{scriptName}".',
  },

  // Service
  service: {
    processFailed: '[{packageName}] {message}',
    installationFailed:
      'Установка зависимостей в {packageName} не удалась (код выхода {exitCode}).',
  },

  // Supervisor
  supervisor: {
    serviceNotRunning: 'Сервис "{target}" не запущен.',
    serviceAlreadyRunning: 'Сервис "{serviceName}" уже запущен.',
    packageNotFound: 'Пакет рабочего пространства "{target}" не найден.',
    packageMissingScript: 'Пакет "{packageName}" не определяет скрипт "{scriptName}".',
    launchContextNotInitialized: 'Контекст запуска не инициализирован.',
    cannotStartWhileShuttingDown: 'Нельзя запускать сервисы во время завершения работы.',
    cannotRestartWhileShuttingDown: 'Нельзя перезапускать сервисы во время завершения работы.',
    serviceNotRunningOrFound: 'Сервис "{target}" не запущен или не найден.',
    noRunningServicesToRestart: 'Нет запущенных сервисов для перезапуска.',
  },

  // Discovery
  discovery: {
    packagesRequired: 'pnpm-workspace.yaml должен объявлять список "packages".',
    noPackagePatterns: 'pnpm-workspace.yaml не содержит никаких паттернов пакетов.',
    packageMustHaveName: 'Пакет в {manifestPath} должен иметь непустое поле "name".',
    invalidJson: 'Неверный JSON в {manifestPath}: {message}',
  },

  // Arguments
  arguments: {
    optionRequiresFilter: 'Опция "{option}" требует фильтр пакета.',
    optionRequiresScript: 'Опция "{option}" требует имя скрипта.',
    filterRequiresValue: 'Опция "--filter" требует фильтр пакета.',
    scriptRequiresValue: 'Опция "--script" требует имя скрипта.',
    unknownOption: 'Неизвестная опция раннера "{option}".',
    optionRequiresLocale: 'Опция "{option}" требует язык (locale).',
    localeRequiresValue: 'Опция "--locale" требует значение.',
    invalidLocale: 'Неподдерживаемый язык: "{locale}". Доступные: ru-RU, en-US.',
  },

  // Command Console
  commandConsole: {
    availableCommands: 'Доступные команды:',
    runUsage: 'Используйте run <package> <command> [args...] для запуска команды в пакете.',
    startUsage: 'Используйте start <package>|<path> для запуска остановленного сервиса.',
    stopUsage:
      'Используйте stop [<package>|<path>] для остановки конкретного сервиса или всех сервисов.',
    restartUsage:
      'Используйте restart [<package>|<path>] для перезапуска сервиса или всех запущенных сервисов.',
    stopAll: 'Остановка сервисов рабочего пространства...',
    stoppingService: 'Остановка сервиса "{target}"...',
    serviceStopped: 'Сервис "{target}" остановлен.',
    serviceStarted: 'Сервис "{serviceName}" запущен.',
    serviceRestarted: 'Сервис "{serviceName}" перезапущен.',
    allServicesRestarted: 'Все запущенные сервисы перезапущены.',
    startUsageError: 'Использование: start <package>|<path>',
    startNotAvailable: 'Запуск недоступен в этой сессии.',
    runUsageError: 'Использование: run <package> <command> [args...]',
    packageNotFound: 'Пакет рабочего пространства "{packageIdentifier}" не найден.',
    commandExited: '{command} завершился с кодом {exitCode}.',
    commandFailed: 'Команда не удалась: {message}',
    unknownCommand: 'Неизвестная команда: {command}',
    stopDescription:
      'Остановить все сервисы рабочего пространства или конкретный: stop [<package>|<path>]',
    startDescription: 'Запустить остановленный сервис: start <package>|<path>',
    restartDescription:
      'Перезапустить сервис или все запущенные сервисы: restart [<package>|<path>]',
    statusDescription: 'Показать статус запущенных сервисов',
    runDescription: 'Запустить команду в пакете рабочего пространства',
    helpDescription: 'Список доступных команд',
    servicesDescription: 'Показать статус сервисов',
    installDescription: 'Выполнить pnpm install в указанных пакетах',
    installUsage: 'Использование: install <package> [package...]',
    installing: 'Установка зависимостей в {packageName}...',
  },

  // Logger
  logger: {
    // These are internal patterns, may not need translation
  },

  // CLI
  cli: {
    // Main entry point errors are handled by orchestrator
  },

  // Common/Shared
  common: {
    error: 'Ошибка',
    warning: 'Предупреждение',
    info: 'Информация',
    success: 'Успех',
    yes: 'Да',
    no: 'Нет',
    or: 'или',
    and: 'и',
  },

  // Pluralization support for "package(s)" in Russian
  // Russian: 1 пакет, 2-4 пакета, 5+ пакетов
  plural: {
    package: {
      one: 'пакет',
      few: 'пакета',
      many: 'пакетов',
    },
    service: {
      one: 'сервис',
      few: 'сервиса',
      many: 'сервисов',
    },
  },
} as const;
