import { TextParser } from './text-parser.js';
/**
 * Форматирует структурированные сообщения и пишет сессионный лог с таймстампами.
 * Обеспечивает ротацию логов, разбор ANSI и обёртку с учётом ширины терминала.
 */
export declare class RunnerLogger {
  private readonly writeToTerminal;
  private readonly logDirectory;
  private readonly getWidth;
  private readonly textParser;
  private readonly logFilePath;
  /**
   * Создаёт новый экземпляр RunnerLogger.
   * @param writeToTerminal - Колбэк для записи форматированного вывода в терминал
   * @param logDirectory - Директория для хранения файлов логов
   * @param getWidth - Функция, возвращающая текущую ширину терминала (по умолчанию: process.stdout.columns || 80)
   * @param textParser - Экземпляр TextParser для разбора строк логов (по умолчанию: new TextParser())
   */
  constructor(
    writeToTerminal: (message: string, isError: boolean) => void,
    logDirectory: string,
    getWidth?: () => number,
    textParser?: TextParser,
  );
  /**
   * Записывает сообщение лога через конвейер таймстампа и файлового лога.
   * Поддерживает флаг `--no-time` для подавления префикса таймстампа.
   * @param values - Значения для логирования (строки, объекты или '--no-time')
   */
  log(...values: unknown[]): void;
  /**
   * Записывает сообщение об ошибке через тот же конвейер таймстампа и файлового лога.
   * @param values - Значения для логирования как ошибка
   */
  error(...values: unknown[]): void;
  /**
   * Логирует сообщение с префиксом (используется для вывода дочерних процессов).
   * @param message - Сообщение для логирования
   * @param continuationIndent - Отступ для перенесённых строк продолжения
   * @param isError - Логировать ли как ошибку
   */
  logPrefixed(message: string, continuationIndent: number, isError?: boolean): void;
  /**
   * Регистрирует пользовательский парсер для будущих строк логов.
   * @param expression - Регулярное выражение для совпадения
   * @param handler - Функция-обработчик для преобразования совпавших строк
   * @returns this (для цепочки вызовов)
   */
  addParser(expression: RegExp, handler: Parameters<TextParser['addParser']>[1]): this;
  /**
   * Логирует вывод сервиса с контекстом пакета, разбирая и оборачивая под ширину терминала.
   * @param message - Сообщение для логирования
   * @param continuationIndent - Отступ для перенесённых строк продолжения
   * @param packageName - Имя пакета (используется для цветового кодирования)
   * @param isError - Логировать ли как ошибку
   */
  logServiceOutput(
    message: string,
    continuationIndent: number,
    packageName: string,
    isError?: boolean,
  ): void;
  private write;
  private rotateOldLogs;
  private createLogFile;
}
//# sourceMappingURL=logger.d.ts.map
