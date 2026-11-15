import chalk from 'chalk';
import {
  registerPhpDotParser,
  registerPhpDurationParser,
  registerPhpTableParser,
  TextParser,
} from '../cli/text-parser.js';
import { startService, runPackageCommand } from '../process/service.js';
import { selectPackages } from '../runner/arguments.js';
import { discoverWorkspacePackages } from '../runner/discovery.js';
import { CommandConsole } from '../commands/command-console.js';
import { ServiceSupervisor } from '../runner/supervisor.js';
import { RunnerLogger } from '../cli/logger.js';
import { assignPackageColors } from './colors.js';
import { printBanner } from './banner.js';
import { formatCommand, readRootManifest } from './utils.js';
import { setupSignalHandlers } from './signals.js';
import { setLocale, t, defaultLocale } from '../i18n/index.js';
/**
 * Основной оркестратор приложения Wisteria CLI.
 * Координирует обнаружение пакетов, супервизор сервисов и интерактивную консоль команд.
 *
 * @example
 * ```ts
 * const orchestrator = new AppOrchestrator('/path/to/monorepo');
 * const exitCode = await orchestrator.run({ script: 'dev', filters: ['apps/*'] });
 * ```
 */
export class AppOrchestrator {
  rootDirectory;
  /**
   * Создаёт новый экземпляр AppOrchestrator.
   * @param rootDirectory - Абсолютный путь к корневой директории монорепозитория (содержит pnpm-workspace.yaml)
   */
  constructor(rootDirectory) {
    this.rootDirectory = rootDirectory;
  }
  /**
   * Запускает стек разработки для выбранных пакетов рабочего пространства.
   * @param options - Опции раннера: имя скрипта, фильтры, режим сухого запуска
   * @returns Код выхода (0 — успех, ненулевое значение — ошибка)
   */
  async run(options) {
    process.env['FORCE_COLOR'] ??= '1';
    chalk.level = 1;
    const localeToUse = options.locale ?? defaultLocale;
    await setLocale(localeToUse);
    const rootManifest = await readRootManifest(this.rootDirectory);
    const packages = await discoverWorkspacePackages(this.rootDirectory);
    const scriptPackages = packages.filter(
      package_ => package_.scripts[options.script] !== undefined,
    );
    const selectedPackages = selectPackages(scriptPackages, options.filters);
    if (selectedPackages.length === 0) {
      throw new Error(t('orchestrator.noPackagesMatched', { script: options.script }));
    }
    const colors = assignPackageColors(selectedPackages);
    for (const package_ of selectedPackages) {
      const script = package_.scripts[options.script];
      const command = formatCommand(script, options.scriptArguments);
      const label = chalk
        .hex(colors.get(package_) ?? '#ffffff')
        .bold(`${package_.name}:${options.script}`);
      console.log(`        ${label} ${chalk.gray('$')} ${command}`);
    }
    if (options.dryRun) return 0;
    let commandConsole;
    const textParser = registerPhpDurationParser(
      registerPhpTableParser(registerPhpDotParser(new TextParser())),
    );
    const logger = new RunnerLogger(
      (message, isError) => {
        if (commandConsole) commandConsole.writeTerminal(message, isError);
        else (isError ? process.stderr : process.stdout).write(`${message}\n`);
      },
      `${this.rootDirectory}/log/server`,
      undefined,
      textParser,
    );
    printBanner(logger, rootManifest);
    const output = (message, isError, outputOptions) => {
      if (outputOptions) {
        logger.logServiceOutput(
          message,
          outputOptions.continuationIndent,
          outputOptions.packageName,
          isError,
        );
      } else if (isError) {
        logger.error(message, '--no-time');
      } else {
        logger.log(message, '--no-time');
      }
    };
    const services = selectedPackages.map(package_ =>
      startService(
        package_,
        options.script,
        options.scriptArguments,
        colors.get(package_) ?? '#ffffff',
        output,
      ),
    );
    const supervisor = new ServiceSupervisor(services);
    supervisor.setLaunchContext({
      scriptName: options.script,
      scriptArguments: options.scriptArguments,
      colors,
      output,
      packages,
      startService,
    });
    if (process.stdin.isTTY && process.stdout.isTTY) {
      commandConsole = new CommandConsole(
        services,
        supervisor,
        packages,
        logger,
        (package_, command, arguments_) =>
          runPackageCommand(package_, command, arguments_, output, supervisor),
      );
      commandConsole.start();
    }
    logger.log(
      t('orchestrator.started', { count: selectedPackages.length, script: options.script }),
    );
    const cleanupSignals = setupSignalHandlers(supervisor, commandConsole, logger);
    const exitCode = await supervisor.run();
    commandConsole?.close();
    cleanupSignals();
    return exitCode;
  }
}
//# sourceMappingURL=orchestrator.js.map
