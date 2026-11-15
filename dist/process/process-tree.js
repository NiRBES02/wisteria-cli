import { t } from '../i18n/index.js';
function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function isMissingPathError(error) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}
/**
 * Отправляет сигнал всему дереву процессов (группе процессов).
 * В Unix использует отрицательный PID для сигнализации группе процессов.
 * Откатывается к child.kill() если сигнализация группе процессов не удалась.
 * @param child - Дочерний процесс с pid
 * @param signal - Сигнал для отправки (например, 'SIGINT', 'SIGKILL')
 */
export function signalProcessTree(child, signal) {
  if (child.pid === undefined) return;
  try {
    process.kill(-child.pid, signal);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ESRCH') return;
    console.error(
      t('processTree.couldNotSendSignal', {
        signal,
        pid: child.pid,
        error: getErrorMessage(error),
      }),
    );
    child.kill(signal);
  }
}
/**
 * Завершает дерево процессов с использованием платформо-зависимой реализации.
 * В Unix: отправляет SIGKILL группе процессов.
 * В Windows: использует taskkill.exe с флагами /T /F.
 * @param child - Дочерний процесс с pid
 * @param package_ - Пакет рабочего пространства (для сообщений об ошибках)
 * @param output - Колбэк для записи вывода ошибок
 * @returns Promise, который разрешается при завершении терминации
 */
export async function terminateProcessTree(child, package_, output) {
  if (child.pid === undefined) return;
  if (process.platform !== 'win32') {
    signalProcessTree(child, 'SIGKILL');
    await child.then(() => undefined);
    return;
  }
  try {
    const { execa } = await import('execa');
    const result = await execa('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
      reject: false,
      stdio: 'ignore',
      windowsHide: true,
    });
    if (result.failed && result.exitCode !== 128) {
      output(
        t('processTree.couldNotTerminateTaskkill', {
          packageName: package_.name,
          exitCode: result.exitCode,
        }),
        true,
      );
      child.kill('SIGKILL');
      await child.then(() => undefined);
    }
  } catch (error) {
    output(
      t('processTree.couldNotTerminate', {
        packageName: package_.name,
        error: getErrorMessage(error),
      }),
      true,
    );
    child.kill('SIGKILL');
    await child.then(() => undefined);
  }
}
export { getErrorMessage, isMissingPathError };
//# sourceMappingURL=process-tree.js.map
