import { existsSync, readFileSync } from 'node:fs';
import { delimiter, extname, isAbsolute } from 'node:path';
import path from 'node:path';
import { execa } from 'execa';
import { splitCommandLine } from '../cli/argument-parser.js';
import { isMissingPathError } from './process-tree.js';
import { t } from '../i18n/index.js';

function quoteShellArgument(argument: string): string {
  return `"${argument.replaceAll('"', '\\"')}"`;
}

/**
 * Проверяет, содержит ли строка скрипта не взятые в кавычки операторы оболочки.
 * @param script - Строка скрипта для проверки
 * @returns true если найдены не взятые в кавычки операторы оболочки
 */
export function hasUnquotedShellOperator(script: string): boolean {
  let quote: '"' | "'" | undefined;
  for (let index = 0; index < script.length; index += 1) {
    const character = script[index];
    if (character === '\\' && quote !== "'" && index + 1 < script.length) {
      index += 1;
      continue;
    }
    if (quote) {
      if (character === quote) quote = undefined;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character && /[&|<>;]/.test(character)) {
      return true;
    }
  }
  return false;
}

/**
 * Определяет, нужно ли запускать команду через Windows shell (cmd/bat).
 * @param command - Имя команды или путь
 * @returns true если команда должна использовать Windows shell
 */
function needsWindowsShell(command: string): boolean {
  if (process.platform !== 'win32') return false;
  if (isAbsolute(command) || extname(command)) return /\.(?:cmd|bat)$/i.test(command);

  const extensions = (process.env['PATHEXT'] ?? '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean);
  const searchDirectories = (process.env['PATH'] ?? '').split(delimiter);
  for (const directory of searchDirectories) {
    const match = extensions.find(extension =>
      existsSync(path.join(directory, `${command}${extension}`)),
    );
    if (match) {
      return /\.(?:cmd|bat)$/i.test(match);
    }
  }
  return true;
}

/**
 * pnpm создаёт .cmd лаунчеры на Windows. Читает точку входа Node из
 * лаунчера и выполняет её с Node напрямую вместо оставления batch shell
 * в дереве процессов каждого сервиса.
 */
function resolveLocalNodeBin(
  command: string,
  cwd: string,
): { executable: string; arguments: string[] } | undefined {
  if (path.basename(command) !== command || command.includes('.')) return undefined;

  const shim = path.join(cwd, 'node_modules', '.bin', `${command}.cmd`);
  let contents: string;
  try {
    contents = readFileSync(shim, 'utf8');
  } catch (error) {
    if (isMissingPathError(error)) return undefined;
    throw error;
  }

  const entry = /^\s*["']?%~dp0\\([^"\r\n]+)["']?\s+%\*/m.exec(contents)?.[1];
  if (!entry) return undefined;

  return {
    executable: process.execPath,
    arguments: [path.resolve(path.dirname(shim), entry.replaceAll('\\', path.sep))],
  };
}

/**
 * Запускает команду напрямую, разрешая pnpm .cmd шимы на Windows.
 * @param command - Имя команды или путь
 * @param arguments_ - Аргументы для передачи команде
 * @param cwd - Рабочая директория
 * @returns execa дочерний процесс
 */
export function launchCommand(command: string, arguments_: string[], cwd: string) {
  const localBin = resolveLocalNodeBin(command, cwd);
  const executable = localBin?.executable ?? command;
  const executableArguments = [...(localBin?.arguments ?? []), ...arguments_];

  return execa(executable, executableArguments, {
    cwd,
    preferLocal: !localBin,
    localDir: cwd,
    shell: !localBin && needsWindowsShell(command),
    detached: process.platform !== 'win32',
    reject: false,
    stdin: 'inherit',
    stdout: 'pipe',
    stderr: 'pipe',
    windowsHide: false,
  });
}

/**
 * Запускает скрипт пакета, обрабатывая операторы оболочки и разбор команд.
 * @param script - Строка скрипта из package.json
 * @param scriptArguments - Дополнительные аргументы для добавления
 * @param cwd - Рабочая директория
 * @returns execa дочерний процесс
 * @throws Error если скрипт пустой
 */
export function launchScript(script: string, scriptArguments: string[], cwd: string) {
  const tokens = splitCommandLine(script);
  if (tokens.length === 0) throw new Error(t('launcher.emptyScript', { script }));

  if (hasUnquotedShellOperator(script)) {
    return execa(`${script} ${scriptArguments.map(quoteShellArgument).join(' ')}`.trim(), {
      cwd,
      preferLocal: true,
      localDir: cwd,
      shell: true,
      detached: process.platform !== 'win32',
      reject: false,
      stdin: 'inherit',
      stdout: 'pipe',
      stderr: 'pipe',
      windowsHide: false,
    });
  }

  const [command = '', ...arguments_] = tokens;
  return launchCommand(command, [...arguments_, ...scriptArguments], cwd);
}
