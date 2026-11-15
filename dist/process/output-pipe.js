import chalk from 'chalk';
function printLine(packageName, line, color, streamName, output) {
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
export function pipeOutput(child, streamName, packageName, color, output) {
  const stream = child[streamName];
  if (!stream) throw new Error(`The ${streamName} stream for "${packageName}" is unavailable.`);
  let pending = '';
  stream.setEncoding('utf8');
  stream.on('data', chunk => {
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
//# sourceMappingURL=output-pipe.js.map
