import type { ServiceOutput } from '../runner/types.js';
interface ChildProcessWithStreams {
  stdout: {
    setEncoding: (encoding: BufferEncoding) => unknown;
    on: (event: string, listener: (chunk: string) => void) => void;
  } | null;
  stderr: {
    setEncoding: (encoding: BufferEncoding) => unknown;
    on: (event: string, listener: (chunk: string) => void) => void;
  } | null;
}
/**
 * Пайпит stdout/stderr дочернего процесса в колбэк вывода с префиксом пакета.
 * Обрабатывает буферизацию частичных строк и правильную маршрутизацию потока ошибок.
 * @param child - Дочерний процесс с потоками stdout/stderr
 * @param streamName - Какой поток пайпить ('stdout' или 'stderr')
 * @param packageName - Имя пакета для цветного префикса
 * @param color - Hex-цвет для префикса пакета
 * @param output - Колбэк для записи форматированного вывода
 */
export declare function pipeOutput(
  child: ChildProcessWithStreams,
  streamName: 'stdout' | 'stderr',
  packageName: string,
  color: string,
  output: ServiceOutput,
): void;
export {};
//# sourceMappingURL=output-pipe.d.ts.map
