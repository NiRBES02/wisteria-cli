import type { CommandConsole } from '../commands/command-console.js';
import type { ServiceSupervisor } from '../runner/supervisor.js';
import type { RunnerLogger } from '../cli/logger.js';
/**
 * Настраивает обработчики сигналов для корректного завершения.
 * Регистрирует обработчики для SIGINT, SIGTERM и SIGBREAK (Windows).
 * @param supervisor - Супервизор сервисов для остановки по сигналу
 * @param commandConsole - Опциональная консоль команд для закрытия по сигналу
 * @param logger - Логгер для сообщений о завершении
 * @returns Функция очистки для удаления обработчиков сигналов
 */
export declare function setupSignalHandlers(
  supervisor: ServiceSupervisor,
  commandConsole: CommandConsole | undefined,
  logger: RunnerLogger,
): () => void;
//# sourceMappingURL=signals.d.ts.map
