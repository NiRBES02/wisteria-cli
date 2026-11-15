import { readFile } from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import { splitCommandLine } from '../cli/argument-parser.js';
/**
 * Находит корень рабочего пространства, ища pnpm-workspace.yaml
 * начиная с указанной директории и поднимаясь вверх по дереву.
 * @param startDir - Директория для начала поиска (по умолчанию: process.cwd())
 * @returns Абсолютный путь к корню рабочего пространства или null, если не найден
 */
export async function findWorkspaceRoot(startDir = process.cwd()) {
  let currentDir = path.resolve(startDir);
  const root = path.parse(currentDir).root;
  while (currentDir !== root) {
    const workspaceFile = path.join(currentDir, 'pnpm-workspace.yaml');
    try {
      await readFile(workspaceFile, 'utf8');
      return currentDir;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        // Файл не найден, продолжаем подниматься вверх
        currentDir = path.dirname(currentDir);
        continue;
      }
      throw error;
    }
  }
  // Проверяем корневую директорию
  const workspaceFile = path.join(root, 'pnpm-workspace.yaml');
  try {
    await readFile(workspaceFile, 'utf8');
    return root;
  } catch {
    return null;
  }
}
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
