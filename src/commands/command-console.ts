import chalk from 'chalk';
import { TerminalInterface } from '../cli/terminal-interface.js';
import { CommandRegistry } from './command-registry.js';
import { registerCustomCommands } from './custom-commands.js';
import type { CommandContext } from './types.js';
import type { RunningService, WorkspacePackage } from '../runner/types.js';
import type { ServiceSupervisor } from '../runner/supervisor.js';
import type { RunnerLogger } from '../cli/logger.js';
import { t } from '../i18n/index.js';

/** Интерактивный командный промпт для управления запущенным рабочим пространством. */
export class CommandConsole {
  private readonly terminal: TerminalInterface;
  private readonly registry: CommandRegistry;
  private isClosed = false;

  private get services(): readonly RunningService[] {
    const supervisorServices = (
      this.supervisor as unknown as { getServices?: () => readonly RunningService[] }
    ).getServices?.();
    if (supervisorServices) return supervisorServices;
    return this.initialServices;
  }

  constructor(
    private readonly initialServices: RunningService[],
    private readonly supervisor: ServiceSupervisor,
    packages: WorkspacePackage[],
    private readonly logger: RunnerLogger,
    runPackage: CommandContext['run'],
  ) {
    const context: CommandContext = {
      get services() {
        const supervisorServices = (
          supervisor as unknown as { getServices?: () => readonly RunningService[] }
        ).getServices?.();
        if (supervisorServices) return supervisorServices;
        return initialServices;
      },
      packages,
      stop: (target?: string) => this.stopServices(target),
      start: (target: string) => this.startService(target),
      restart: (target?: string) => this.restartService(target),
      write: (message, isError) => this.writeLog(message, isError),
      run: async (package_, command, arguments_) => {
        this.terminal.pause();
        try {
          return await runPackage(package_, command, arguments_);
        } finally {
          this.terminal.resume();
        }
      },
    } as CommandContext;
    this.registry = new CommandRegistry(context);
    this.terminal = new TerminalInterface(line => this.complete(line));
    this.registerBuiltInCommands();
    registerCustomCommands(this.registry, context);
    this.terminal.onLine(line => void this.execute(line));
    this.terminal.onInterrupt(() => void this.stopServices());
    this.terminal.onClose(() => {
      this.isClosed = true;
      void this.supervisor.stopAll();
    });
  }

  /** Запускает командный промпт. */
  start(): void {
    this.terminal.start();
  }

  /** Записывает лог раннера или дочернего процесса, сохраняя промпт. */
  writeLog(message: string, isError = false): void {
    if (isError) this.logger.error(message, '--no-time');
    else this.logger.log(message, '--no-time');
  }

  /** Записывает уже отформатированный текст логгера в терминал или перенаправленный поток. */
  writeTerminal(message: string, isError = false): void {
    this.terminal.writeLog(message, isError);
  }

  /** Закрывает входной промпт. */
  close(): void {
    if (!this.isClosed) this.terminal.close();
  }

  private registerBuiltInCommands(): void {
    this.registry.register(['help', 'h', '?'], t('commandConsole.helpDescription'), () => {
      this.logger.log(chalk.bold(t('commandConsole.availableCommands')));
      for (const command of this.registry.list()) {
        const aliases =
          command.aliases.length > 0 ? chalk.gray(` (${command.aliases.join(', ')})`) : '';
        this.logger.log(`  ${chalk.cyan(command.name)}${aliases} - ${command.description}`);
      }
      this.logger.log(t('commandConsole.runUsage'));
      this.logger.log(t('commandConsole.startUsage'));
      this.logger.log(t('commandConsole.stopUsage'));
      this.logger.log(t('commandConsole.restartUsage'));
    });

    this.registry.register(
      ['stop', 'exit', 'quit', 'down'],
      t('commandConsole.stopDescription'),
      async (arguments_, context) => {
        const target = arguments_.unknown[0];
        if (!target) {
          context.write(t('commandConsole.stopAll'));
          await context.stop();
          return;
        }
        context.write(t('commandConsole.stoppingService', { target }));
        await context.stop(target);
      },
    );

    this.registry.register(
      ['start'],
      t('commandConsole.startDescription'),
      async (arguments_, context) => {
        const target = arguments_.unknown[0];
        if (!target) {
          throw new Error(t('commandConsole.startUsageError'));
        }
        if (context.start) {
          await context.start(target);
        } else {
          throw new Error(t('commandConsole.startNotAvailable'));
        }
      },
    );

    this.registry.register(
      ['restart', 'reload'],
      t('commandConsole.restartDescription'),
      async (arguments_, context) => {
        const target = arguments_.unknown[0];
        if (context.restart) {
          await context.restart(target);
        } else {
          throw new Error(t('commandConsole.startNotAvailable'));
        }
      },
    );

    this.registry.register('status', t('commandConsole.statusDescription'), () => {
      for (const service of this.services) {
        this.logger.log(`${service.package.name}: ${service.status}`);
      }
    });

    this.registry.register(
      'run',
      t('commandConsole.runDescription'),
      async (arguments_, context) => {
        const [packageIdentifier, command, ...commandArguments] = arguments_.raw;
        if (!packageIdentifier || !command) {
          throw new Error(t('commandConsole.runUsageError'));
        }
        const package_ = resolvePackage(context.packages, packageIdentifier);
        if (!package_) throw new Error(t('commandConsole.packageNotFound', { packageIdentifier }));
        const exitCode = await context.run(package_, command, commandArguments);
        if (exitCode !== 0)
          context.write(t('commandConsole.commandExited', { command, exitCode }), true);
      },
    );
  }

  private complete(line: string): [string[], string] {
    const commandPrefix = line.split(/\s/, 1)[0]?.toLowerCase() ?? '';
    const matches = this.registry
      .list()
      .flatMap(command => [command.name, ...command.aliases])
      .filter(name => name.startsWith(commandPrefix));
    return [matches, commandPrefix];
  }

  private async execute(line: string): Promise<void> {
    const input = line.trim();
    if (!input) {
      if (!this.isClosed) this.terminal.refreshPrompt();
      return;
    }

    const found = await this.registry.execute(input, message => {
      this.writeLog(t('commandConsole.commandFailed', { message }), true);
    });

    if (!found)
      this.writeLog(
        t('commandConsole.unknownCommand', { command: input.split(/\s+/, 1)[0] }),
        true,
      );
    if (!this.isClosed) this.terminal.refreshPrompt();
  }

  private async stopServices(target?: string): Promise<void> {
    if (!target) {
      this.close();
      await this.supervisor.stopAll();
      return;
    }

    try {
      await this.supervisor.stopService(target);
      this.writeLog(t('commandConsole.serviceStopped', { target }), false);
    } catch (error) {
      this.writeLog(error instanceof Error ? error.message : String(error), true);
    }
  }

  private async startService(target: string): Promise<void> {
    try {
      const service = await this.supervisor.startService(target);
      this.writeLog(
        t('commandConsole.serviceStarted', { serviceName: service.package.name }),
        false,
      );
    } catch (error) {
      this.writeLog(error instanceof Error ? error.message : String(error), true);
    }
  }

  private async restartService(target?: string): Promise<void> {
    try {
      if (target) {
        const service = await this.supervisor.restartService(target);
        this.writeLog(
          t('commandConsole.serviceRestarted', { serviceName: service.package.name }),
          false,
        );
        return;
      }

      await this.supervisor.restartAll();
      this.writeLog(t('commandConsole.allServicesRestarted'), false);
    } catch (error) {
      this.writeLog(error instanceof Error ? error.message : String(error), true);
    }
  }
}

function resolvePackage(
  packages: WorkspacePackage[],
  identifier: string,
): WorkspacePackage | undefined {
  const normalized = identifier.replaceAll('\\', '/').replace(/\/+$/, '');
  return packages.find(
    package_ => package_.name === identifier || package_.relativeDirectory === normalized,
  );
}
