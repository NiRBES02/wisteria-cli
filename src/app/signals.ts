import type { CommandConsole } from '../commands/command-console.js';
import type { ServiceSupervisor } from '../runner/supervisor.js';
import type { RunnerLogger } from '../cli/logger.js';
import { t } from '../i18n/index.js';

/**
 * Настраивает обработчики сигналов для корректного завершения.
 * Регистрирует обработчики для SIGINT, SIGTERM и SIGBREAK (Windows).
 * @param supervisor - Супервизор сервисов для остановки по сигналу
 * @param commandConsole - Опциональная консоль команд для закрытия по сигналу
 * @param logger - Логгер для сообщений о завершении
 * @returns Функция очистки для удаления обработчиков сигналов
 */
export function setupSignalHandlers(
  supervisor: ServiceSupervisor,
  commandConsole: CommandConsole | undefined,
  logger: RunnerLogger,
): () => void {
  let stopRequested = false;

  const requestStop = (signal: NodeJS.Signals) => {
    if (stopRequested) {
      void supervisor.forceStopAll();
      return;
    }
    stopRequested = true;
    commandConsole?.close();
    logger.log(t('signals.stopping', { signal }));
    void supervisor.stopAll();
  };

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  if (process.platform === 'win32') signals.push('SIGBREAK');

  const signalHandlers = new Map<NodeJS.Signals, () => void>();
  for (const signal of signals) {
    const handler = () => requestStop(signal);
    signalHandlers.set(signal, handler);
    process.on(signal, handler);
  }

  return () => {
    for (const [signal, handler] of signalHandlers) {
      process.removeListener(signal, handler);
    }
  };
}
