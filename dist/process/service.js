import { launchCommand, launchScript } from './launcher.js';
import { pipeOutput } from './output-pipe.js';
import { signalProcessTree, terminateProcessTree } from './process-tree.js';
import { t } from '../i18n/index.js';
const SHUTDOWN_GRACE_MS = 2_500;
/**
 * Запускает команду, объявленную скриптом пакета, без добавления процесса
 * менеджера пакетов между раннером и самим приложением.
 * @param package_ - Пакет рабочего пространства, содержащий скрипт
 * @param scriptName - Имя скрипта для запуска (например, 'dev', 'build')
 * @param scriptArguments - Дополнительные аргументы для передачи скрипту
 * @param color - Hex-код цвета для префикса вывода пакета
 * @param output - Колбэк для записи вывода сервиса
 * @returns Экземпляр RunningService со статусом, pid и промисом завершения
 * @throws Error если скрипт не определён в пакете
 */
export function startService(package_, scriptName, scriptArguments, color, output) {
  const script = package_.scripts[scriptName];
  if (!script)
    throw new Error(t('launcher.packageMissingScript', { packageName: package_.name, scriptName }));
  const child = launchScript(script, scriptArguments, package_.directory);
  let status = 'running';
  pipeOutput(child, 'stdout', package_.name, color, output);
  pipeOutput(child, 'stderr', package_.name, color, output);
  const completion = child.then(result => {
    status = 'stopped';
    if (result.failed && result.exitCode === undefined && result.signal === undefined) {
      output(
        t('service.processFailed', { packageName: package_.name, message: result.shortMessage }),
        true,
      );
      return 1;
    }
    return result.exitCode ?? 1;
  });
  let stopPromise;
  let forceStopPromise;
  return {
    package: package_,
    color,
    get pid() {
      return child.pid;
    },
    get status() {
      return status;
    },
    completion,
    stop: (force = false) => {
      if (status === 'stopped') return completion.then(() => undefined);
      status = 'stopping';
      if (force) {
        forceStopPromise ??= terminateProcessTree(child, package_, output);
        return forceStopPromise;
      }
      stopPromise ??= (async () => {
        if (process.platform !== 'win32') signalProcessTree(child, 'SIGINT');
        let timeout;
        const stopped = await Promise.race([
          completion.then(() => true),
          new Promise(resolve => {
            timeout = setTimeout(() => resolve(false), SHUTDOWN_GRACE_MS);
          }),
        ]);
        if (timeout) clearTimeout(timeout);
        if (!stopped) {
          forceStopPromise ??= terminateProcessTree(child, package_, output);
          await forceStopPromise;
        }
        await completion;
      })();
      return stopPromise;
    },
  };
}
/**
 * Запускает произвольную команду из директории пакета, для интерактивных
 * команд вроде `run api php artisan migrate`.
 * @param package_ - Пакет рабочего пространства для запуска команды
 * @param command - Команда для выполнения
 * @param arguments_ - Аргументы для передачи команде
 * @param output - Колбэк для записи вывода команды
 * @param supervisor - Опциональный супервизор для отслеживания команды при завершении
 * @returns Код выхода команды
 */
export async function runPackageCommand(package_, command, arguments_, output, supervisor) {
  const child = launchCommand(command, arguments_, package_.directory);
  const unregister = supervisor?.trackCommand(() => terminateProcessTree(child, package_, output));
  pipeOutput(child, 'stdout', package_.name, 'white', output);
  pipeOutput(child, 'stderr', package_.name, 'white', output);
  let result;
  try {
    result = await child;
  } finally {
    unregister?.();
  }
  if (result.failed && result.exitCode === undefined && result.signal === undefined) {
    output(
      t('service.processFailed', { packageName: package_.name, message: result.shortMessage }),
      true,
    );
    return 1;
  }
  return result.exitCode ?? 1;
}
//# sourceMappingURL=service.js.map
