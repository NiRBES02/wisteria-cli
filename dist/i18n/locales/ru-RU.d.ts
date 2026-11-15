/**
 * Russian locale (source of truth).
 * All translation keys are defined here first, then translated to other locales.
 * This file is the authoritative source for all translation keys and structure.
 * Other locales (e.g., en-US) must maintain the same key structure.
 */
declare const _default: {
  readonly banner: {
    readonly project: 'Проект';
    readonly version: 'Версия';
  };
  readonly signals: {
    readonly stopping: 'Остановка пакетов рабочего пространства ({signal})...';
  };
  readonly orchestrator: {
    readonly noPackagesMatched: 'Ни один пакет рабочего пространства не соответствует запрошенным фильтрам и скрипту "{script}".';
    readonly started: 'Запущено {count} пакет(ов) со скриптом "{script}".';
  };
  readonly processTree: {
    readonly couldNotSendSignal: 'Не удалось отправить {signal} дереву процессов {pid}: {error}';
    readonly couldNotTerminateTaskkill: '[{packageName}] Не удалось завершить дерево процессов (taskkill exit code {exitCode}).';
    readonly couldNotTerminate: '[{packageName}] Не удалось завершить дерево процессов: {error}';
  };
  readonly launcher: {
    readonly emptyScript: 'Нельзя запустить пустой скрипт пакета: "{script}".';
    readonly packageMissingScript: 'Пакет "{packageName}" не определяет скрипт "{scriptName}".';
  };
  readonly service: {
    readonly processFailed: '[{packageName}] {message}';
    readonly installationFailed: 'Установка зависимостей в {packageName} не удалась (код выхода {exitCode}).';
  };
  readonly supervisor: {
    readonly serviceNotRunning: 'Сервис "{target}" не запущен.';
    readonly serviceAlreadyRunning: 'Сервис "{serviceName}" уже запущен.';
    readonly packageNotFound: 'Пакет рабочего пространства "{target}" не найден.';
    readonly packageMissingScript: 'Пакет "{packageName}" не определяет скрипт "{scriptName}".';
    readonly launchContextNotInitialized: 'Контекст запуска не инициализирован.';
    readonly cannotStartWhileShuttingDown: 'Нельзя запускать сервисы во время завершения работы.';
    readonly cannotRestartWhileShuttingDown: 'Нельзя перезапускать сервисы во время завершения работы.';
    readonly serviceNotRunningOrFound: 'Сервис "{target}" не запущен или не найден.';
    readonly noRunningServicesToRestart: 'Нет запущенных сервисов для перезапуска.';
  };
  readonly discovery: {
    readonly packagesRequired: 'pnpm-workspace.yaml должен объявлять список "packages".';
    readonly noPackagePatterns: 'pnpm-workspace.yaml не содержит никаких паттернов пакетов.';
    readonly packageMustHaveName: 'Пакет в {manifestPath} должен иметь непустое поле "name".';
    readonly invalidJson: 'Неверный JSON в {manifestPath}: {message}';
  };
  readonly arguments: {
    readonly optionRequiresFilter: 'Опция "{option}" требует фильтр пакета.';
    readonly optionRequiresScript: 'Опция "{option}" требует имя скрипта.';
    readonly filterRequiresValue: 'Опция "--filter" требует фильтр пакета.';
    readonly scriptRequiresValue: 'Опция "--script" требует имя скрипта.';
    readonly unknownOption: 'Неизвестная опция раннера "{option}".';
    readonly optionRequiresLocale: 'Опция "{option}" требует язык (locale).';
    readonly localeRequiresValue: 'Опция "--locale" требует значение.';
    readonly invalidLocale: 'Неподдерживаемый язык: "{locale}". Доступные: ru-RU, en-US.';
  };
  readonly commandConsole: {
    readonly availableCommands: 'Доступные команды:';
    readonly runUsage: 'Используйте run <package> <command> [args...] для запуска команды в пакете.';
    readonly startUsage: 'Используйте start <package>|<path> для запуска остановленного сервиса.';
    readonly stopUsage: 'Используйте stop [<package>|<path>] для остановки конкретного сервиса или всех сервисов.';
    readonly restartUsage: 'Используйте restart [<package>|<path>] для перезапуска сервиса или всех запущенных сервисов.';
    readonly stopAll: 'Остановка сервисов рабочего пространства...';
    readonly stoppingService: 'Остановка сервиса "{target}"...';
    readonly serviceStopped: 'Сервис "{target}" остановлен.';
    readonly serviceStarted: 'Сервис "{serviceName}" запущен.';
    readonly serviceRestarted: 'Сервис "{serviceName}" перезапущен.';
    readonly allServicesRestarted: 'Все запущенные сервисы перезапущены.';
    readonly startUsageError: 'Использование: start <package>|<path>';
    readonly startNotAvailable: 'Запуск недоступен в этой сессии.';
    readonly runUsageError: 'Использование: run <package> <command> [args...]';
    readonly packageNotFound: 'Пакет рабочего пространства "{packageIdentifier}" не найден.';
    readonly commandExited: '{command} завершился с кодом {exitCode}.';
    readonly commandFailed: 'Команда не удалась: {message}';
    readonly unknownCommand: 'Неизвестная команда: {command}';
    readonly stopDescription: 'Остановить все сервисы рабочего пространства или конкретный: stop [<package>|<path>]';
    readonly startDescription: 'Запустить остановленный сервис: start <package>|<path>';
    readonly restartDescription: 'Перезапустить сервис или все запущенные сервисы: restart [<package>|<path>]';
    readonly statusDescription: 'Показать статус запущенных сервисов';
    readonly runDescription: 'Запустить команду в пакете рабочего пространства';
    readonly helpDescription: 'Список доступных команд';
    readonly servicesDescription: 'Показать статус сервисов';
    readonly installDescription: 'Выполнить pnpm install в указанных пакетах';
    readonly installUsage: 'Использование: install <package> [package...]';
    readonly installing: 'Установка зависимостей в {packageName}...';
  };
  readonly logger: {};
  readonly cli: {};
  readonly common: {
    readonly error: 'Ошибка';
    readonly warning: 'Предупреждение';
    readonly info: 'Информация';
    readonly success: 'Успех';
    readonly yes: 'Да';
    readonly no: 'Нет';
    readonly or: 'или';
    readonly and: 'и';
  };
  readonly plural: {
    readonly package: {
      readonly one: 'пакет';
      readonly few: 'пакета';
      readonly many: 'пакетов';
    };
    readonly service: {
      readonly one: 'сервис';
      readonly few: 'сервиса';
      readonly many: 'сервисов';
    };
  };
};
export default _default;
//# sourceMappingURL=ru-RU.d.ts.map
