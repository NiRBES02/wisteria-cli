import type { CommandContext } from './types.js';
import type { RunningService, WorkspacePackage } from '../runner/types.js';
import type { ServiceSupervisor } from '../runner/supervisor.js';
import type { RunnerLogger } from '../cli/logger.js';
/** Интерактивный командный промпт для управления запущенным рабочим пространством. */
export declare class CommandConsole {
  private readonly initialServices;
  private readonly supervisor;
  private readonly logger;
  private readonly terminal;
  private readonly registry;
  private isClosed;
  private get services();
  constructor(
    initialServices: RunningService[],
    supervisor: ServiceSupervisor,
    packages: WorkspacePackage[],
    logger: RunnerLogger,
    runPackage: CommandContext['run'],
  );
  /** Запускает командный промпт. */
  start(): void;
  /** Записывает лог раннера или дочернего процесса, сохраняя промпт. */
  writeLog(message: string, isError?: boolean): void;
  /** Записывает уже отформатированный текст логгера в терминал или перенаправленный поток. */
  writeTerminal(message: string, isError?: boolean): void;
  /** Закрывает входной промпт. */
  close(): void;
  private registerBuiltInCommands;
  private complete;
  private execute;
  private stopServices;
  private startService;
  private restartService;
}
//# sourceMappingURL=command-console.d.ts.map
