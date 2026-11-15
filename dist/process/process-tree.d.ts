import type { ServiceOutput, WorkspacePackage } from '../runner/types.js';
/**
 * Интерфейс для объектов, похожих на дочерние процессы, с pid и методом kill.
 */
interface ChildProcessLike {
  pid?: number;
  kill(signal?: NodeJS.Signals): void;
  then<T>(onfulfilled?: (value: unknown) => T | PromiseLike<T>): Promise<T>;
}
declare function getErrorMessage(error: unknown): string;
declare function isMissingPathError(error: unknown): boolean;
/**
 * Отправляет сигнал всему дереву процессов (группе процессов).
 * В Unix использует отрицательный PID для сигнализации группе процессов.
 * Откатывается к child.kill() если сигнализация группе процессов не удалась.
 * @param child - Дочерний процесс с pid
 * @param signal - Сигнал для отправки (например, 'SIGINT', 'SIGKILL')
 */
export declare function signalProcessTree(child: ChildProcessLike, signal: NodeJS.Signals): void;
/**
 * Завершает дерево процессов с использованием платформо-зависимой реализации.
 * В Unix: отправляет SIGKILL группе процессов.
 * В Windows: использует taskkill.exe с флагами /T /F.
 * @param child - Дочерний процесс с pid
 * @param package_ - Пакет рабочего пространства (для сообщений об ошибках)
 * @param output - Колбэк для записи вывода ошибок
 * @returns Promise, который разрешается при завершении терминации
 */
export declare function terminateProcessTree(
  child: ChildProcessLike,
  package_: WorkspacePackage,
  output: ServiceOutput,
): Promise<void>;
export { getErrorMessage, isMissingPathError };
//# sourceMappingURL=process-tree.d.ts.map
