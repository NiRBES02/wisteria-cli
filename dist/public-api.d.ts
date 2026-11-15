/**
 * Публичный API WisteriaCli.
 * Точка входа для использования WisteriaCli как библиотеки.
 *
 * @module wisteria-cli
 * @example
 * ```ts
 * import { createWisteria, AppOrchestrator, ServiceSupervisor } from 'wisteria-cli';
 *
 * // Фабрика для быстрого старта
 * const wisteria = createWisteria({
 *   rootDir: '/path/to/monorepo',
 *   locale: 'ru-RU'
 * });
 *
 * // Запуск с опциями раннера
 * await wisteria.run({
 *   script: 'dev',
 *   filters: ['@myorg/*'],
 *   scriptArguments: ['--port=3000'],
 *   dryRun: false
 * });
 *
 * // Или прямое использование классов
 * const orchestrator = new AppOrchestrator('/path/to/monorepo');
 * await orchestrator.run({
 *   script: 'dev',
 *   filters: []
 * });
 * ```
 */
export { AppOrchestrator } from './app/orchestrator.js';
export { printBanner } from './app/banner.js';
export { assignPackageColors } from './app/colors.js';
export { setupSignalHandlers } from './app/signals.js';
export { formatCommand, readRootManifest } from './app/utils.js';
export { parseArguments } from './runner/arguments.js';
export { RunnerLogger } from './cli/logger.js';
export {
  TextParser,
  registerPhpDotParser,
  registerPhpTableParser,
  registerPhpDurationParser,
} from './cli/text-parser.js';
export { TerminalInterface } from './cli/terminal-interface.js';
export { CommandRegistry, parseCommandArguments } from './commands/command-registry.js';
export { CommandConsole } from './commands/command-console.js';
export { registerCustomCommands } from './commands/custom-commands.js';
export type { CommandContext, CommandDefinition, CommandHandler } from './commands/types.js';
export type { ParsedArguments } from './runner/types.js';
export { getLocale, setLocale, t, loadLocale, clearLocaleCache } from './i18n/index.js';
export type {
  Locale,
  TranslationParams,
  NestedKeys,
  TranslationKeys,
  LocaleMessages,
  LocaleConfig,
} from './i18n/types.js';
export {
  availableLocales,
  defaultLocale,
  fallbackLocale,
  isLocaleSupported,
} from './i18n/locales/index.js';
export { startService, runPackageCommand } from './process/service.js';
export { ServiceSupervisor } from './runner/supervisor.js';
export { discoverWorkspacePackages } from './runner/discovery.js';
export { selectPackages } from './runner/arguments.js';
export type { RunnerOptions, WorkspacePackage } from './runner/types.js';
import { getLocale, setLocale, t } from './i18n/index.js';
import type { RunnerOptions } from './runner/types.js';
/**
 * Создаёт экземпляр Wisteria CLI с настроенными зависимостями.
 * Удобная фабрика для использования в качестве библиотеки.
 *
 * @param config - Конфигурация экземпляра
 * @returns Объект с методами run, registry и доступом к i18n
 *
 * @example
 * ```ts
 * import { createWisteria } from 'wisteria-cli';
 *
 * const wisteria = createWisteria({
 *   rootDir: process.cwd(),
 *   locale: 'ru-RU'
 * });
 *
 * await wisteria.run({
 *   script: 'dev',
 *   filters: ['apps/*']
 * });
 * ```
 */
export declare function createWisteria(config: {
  rootDir: string;
  locale?: RunnerOptions['locale'];
}): {
  /**
   * Запускает оркестратор с заданными опциями.
   */
  run(options: RunnerOptions): Promise<number>;
  /**
   * Реестр команд для регистрации пользовательских команд.
   * Назначьте `registerCustomCommands` для расширения функционала.
   */
  registry: {
    registerCustomCommands:
      ((registry: CommandRegistry, context: CommandContext) => void) | undefined;
  };
  /**
   * Функции i18n для перевода.
   */
  i18n: {
    t: typeof t;
    setLocale: typeof setLocale;
    getLocale: typeof getLocale;
  };
};
import type { CommandRegistry } from './commands/command-registry.js';
import type { CommandContext } from './commands/types.js';
//# sourceMappingURL=public-api.d.ts.map
