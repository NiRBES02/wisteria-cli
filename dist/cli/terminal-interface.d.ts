/**
 * Владеет интерактивным промптом и обеспечивает читаемость асинхронных логов.
 * Управляет интерфейсом readline, автодополнением и выводом логов во время интерактивных сессий.
 */
export declare class TerminalInterface {
  private readonly promptText;
  private readonly readline;
  private readonly isInteractive;
  private isClosed;
  private isPaused;
  /**
   * Создаёт новый TerminalInterface.
   * @param completer - Функция, предоставляющая подсказки для автодополнения по Tab
   * @param promptText - Текст для отображения в промпте (по умолчанию: 'wis> ')
   */
  constructor(completer: (line: string) => [string[], string], promptText?: string);
  /**
   * Регистрирует колбэк для завершённых строк команд.
   * @param callback - Функция, вызываемая с введённой строкой
   */
  onLine(callback: (line: string) => void): void;
  /**
   * Регистрирует колбэк для Ctrl+C (SIGINT) пока промпт активен.
   * @param callback - Функция, вызываемая при прерывании
   */
  onInterrupt(callback: () => void): void;
  /**
   * Регистрирует колбэк для закрытия stdin.
   * @param callback - Функция, вызываемая при закрытии
   */
  onClose(callback: () => void): void;
  /**
   * Показывает промпт, если подключён к интерактивному терминалу.
   */
  start(): void;
  /**
   * Очищает текущую строку ввода, выводит сообщение и перерисовывает промпт.
   * @param message - Сообщение для вывода
   * @param isError - Выводить ли в stderr
   */
  writeLog(message: string, isError?: boolean): void;
  /**
   * Передаёт stdin команде пакета, которая сама может быть интерактивной.
   * Приостанавливает интерфейс readline.
   */
  pause(): void;
  /**
   * Возвращает stdin в командный промпт после выхода команды пакета.
   * Возобновляет интерфейс readline.
   */
  resume(): void;
  /**
   * Обновляет варианты автодополнения при динамической регистрации команд.
   * Перерисовывает промпт с новыми опциями автодополнения.
   */
  refreshPrompt(): void;
  /**
   * Закрывает интерфейс readline.
   */
  close(): void;
}
//# sourceMappingURL=terminal-interface.d.ts.map
