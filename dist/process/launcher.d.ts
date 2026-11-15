/**
 * Проверяет, содержит ли строка скрипта не взятые в кавычки операторы оболочки.
 * @param script - Строка скрипта для проверки
 * @returns true если найдены не взятые в кавычки операторы оболочки
 */
export declare function hasUnquotedShellOperator(script: string): boolean;
/**
 * Запускает команду напрямую, разрешая pnpm .cmd шимы на Windows.
 * @param command - Имя команды или путь
 * @param arguments_ - Аргументы для передачи команде
 * @param cwd - Рабочая директория
 * @returns execa дочерний процесс
 */
export declare function launchCommand(
  command: string,
  arguments_: string[],
  cwd: string,
): import('execa').ResultPromise<{
  cwd: string;
  preferLocal: boolean;
  localDir: string;
  shell: boolean;
  detached: boolean;
  reject: false;
  stdin: 'inherit';
  stdout: 'pipe';
  stderr: 'pipe';
  windowsHide: false;
}>;
/**
 * Запускает скрипт пакета, обрабатывая операторы оболочки и разбор команд.
 * @param script - Строка скрипта из package.json
 * @param scriptArguments - Дополнительные аргументы для добавления
 * @param cwd - Рабочая директория
 * @returns execa дочерний процесс
 * @throws Error если скрипт пустой
 */
export declare function launchScript(
  script: string,
  scriptArguments: string[],
  cwd: string,
):
  | import('execa').ResultPromise<{
      cwd: string;
      preferLocal: boolean;
      localDir: string;
      shell: boolean;
      detached: boolean;
      reject: false;
      stdin: 'inherit';
      stdout: 'pipe';
      stderr: 'pipe';
      windowsHide: false;
    }>
  | import('execa').ResultPromise<{
      cwd: string;
      preferLocal: true;
      localDir: string;
      shell: true;
      detached: boolean;
      reject: false;
      stdin: 'inherit';
      stdout: 'pipe';
      stderr: 'pipe';
      windowsHide: false;
    }>;
//# sourceMappingURL=launcher.d.ts.map
