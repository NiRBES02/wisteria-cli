import chalk from 'chalk';
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

function printLine(
  packageName: string,
  line: string,
  color: string,
  streamName: 'stdout' | 'stderr',
  output: ServiceOutput,
): void {
  const label = chalk.hex(color)(`${packageName}:`);
  output(`${label} ${line}`, streamName === 'stderr', {
    continuationIndent: packageName.length + 2 + (line.match(/^\s*/)?.[0].length ?? 0),
    packageName,
  });
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
export function pipeOutput(
  child: ChildProcessWithStreams,
  streamName: 'stdout' | 'stderr',
  packageName: string,
  color: string,
  output: ServiceOutput,
): void {
  const stream = child[streamName];
  if (!stream) throw new Error(`The ${streamName} stream for "${packageName}" is unavailable.`);

  let pending = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk: string) => {
    pending += chunk;
    const lines = pending.split(/\r?\n/);
    pending = lines.pop() ?? '';
    for (const line of lines) printLine(packageName, line, color, streamName, output);
  });
  stream.on('end', () => {
    if (pending) printLine(packageName, pending, color, streamName, output);
    pending = '';
  });
}
