import { readFile } from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import { splitCommandLine } from '../cli/argument-parser.js';
/**
 * Читает манифест корневого package.json.
 * @param root - Абсолютный путь к корню монорепозитория
 * @returns Разобранный манифест пакета
 */
export async function readRootManifest(root) {
  const manifestPath = path.join(root, 'package.json');
  return JSON.parse(await readFile(manifestPath, 'utf8'));
}
/**
 * Форматирует команду с дополнительными аргументами для отображения.
 * Раскрашивает имя команды и аргументы.
 * @param script - Исходная строка скрипта из package.json
 * @param extraArguments - Дополнительные аргументы для добавления
 * @returns Отформатированная цветом строка команды
 */
export function formatCommand(script, extraArguments) {
  const tokens = [...splitCommandLine(script), ...extraArguments];
  return tokens
    .map((token, index) => (index === 0 ? chalk.white.bold(token) : chalk.cyan(token)))
    .join(' ');
}
//# sourceMappingURL=utils.js.map
