import readline from 'node:readline';
/**
 * Владеет интерактивным промптом и обеспечивает читаемость асинхронных логов.
 * Управляет интерфейсом readline, автодополнением и выводом логов во время интерактивных сессий.
 */
export class TerminalInterface {
  promptText;
  readline;
  isInteractive;
  isClosed = false;
  isPaused = false;
  /**
   * Создаёт новый TerminalInterface.
   * @param completer - Функция, предоставляющая подсказки для автодополнения по Tab
   * @param promptText - Текст для отображения в промпте (по умолчанию: 'wis> ')
   */
  constructor(completer, promptText = 'wis> ') {
    this.promptText = promptText;
    this.isInteractive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: this.isInteractive,
      completer: this.isInteractive ? completer : undefined,
    });
    this.readline.setPrompt(promptText);
  }
  /**
   * Регистрирует колбэк для завершённых строк команд.
   * @param callback - Функция, вызываемая с введённой строкой
   */
  onLine(callback) {
    this.readline.on('line', callback);
  }
  /**
   * Регистрирует колбэк для Ctrl+C (SIGINT) пока промпт активен.
   * @param callback - Функция, вызываемая при прерывании
   */
  onInterrupt(callback) {
    this.readline.on('SIGINT', callback);
  }
  /**
   * Регистрирует колбэк для закрытия stdin.
   * @param callback - Функция, вызываемая при закрытии
   */
  onClose(callback) {
    this.readline.on('close', callback);
  }
  /**
   * Показывает промпт, если подключён к интерактивному терминалу.
   */
  start() {
    if (this.isInteractive) this.readline.prompt();
  }
  /**
   * Очищает текущую строку ввода, выводит сообщение и перерисовывает промпт.
   * @param message - Сообщение для вывода
   * @param isError - Выводить ли в stderr
   */
  writeLog(message, isError = false) {
    if (this.isInteractive && !this.isClosed && !this.isPaused) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${message}\n`);
      this.readline.prompt(true);
      return;
    }
    (isError ? process.stderr : process.stdout).write(`${message}\n`);
  }
  /**
   * Передаёт stdin команде пакета, которая сама может быть интерактивной.
   * Приостанавливает интерфейс readline.
   */
  pause() {
    if (!this.isInteractive || this.isClosed || this.isPaused) return;
    this.isPaused = true;
    this.readline.pause();
  }
  /**
   * Возвращает stdin в командный промпт после выхода команды пакета.
   * Возобновляет интерфейс readline.
   */
  resume() {
    if (!this.isInteractive || this.isClosed || !this.isPaused) return;
    this.isPaused = false;
    this.readline.resume();
  }
  /**
   * Обновляет варианты автодополнения при динамической регистрации команд.
   * Перерисовывает промпт с новыми опциями автодополнения.
   */
  refreshPrompt() {
    if (this.isInteractive && !this.isClosed) this.readline.prompt(true);
  }
  /**
   * Закрывает интерфейс readline.
   */
  close() {
    if (this.isClosed) return;
    this.isClosed = true;
    this.readline.close();
  }
}
//# sourceMappingURL=terminal-interface.js.map
