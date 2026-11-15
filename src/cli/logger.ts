import {
  appendFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import { TextParser } from './text-parser.js';

const LOG_RETENTION_MS = 7 * 24 * 60 * 60 * 1_000;
// eslint-disable-next-line no-control-regex
const ANSI_PATTERN = /\u001B\[[0-?]*[ -/]*[@-~]/g;

/**
 * Форматирует структурированные сообщения и пишет сессионный лог с таймстампами.
 * Обеспечивает ротацию логов, разбор ANSI и обёртку с учётом ширины терминала.
 */
export class RunnerLogger {
  private readonly logFilePath: string;

  /**
   * Создаёт новый экземпляр RunnerLogger.
   * @param writeToTerminal - Колбэк для записи форматированного вывода в терминал
   * @param logDirectory - Директория для хранения файлов логов
   * @param getWidth - Функция, возвращающая текущую ширину терминала (по умолчанию: process.stdout.columns || 80)
   * @param textParser - Экземпляр TextParser для разбора строк логов (по умолчанию: new TextParser())
   */
  constructor(
    private readonly writeToTerminal: (message: string, isError: boolean) => void,
    private readonly logDirectory: string,
    private readonly getWidth: () => number = () => process.stdout.columns || 80,
    private readonly textParser = new TextParser(),
  ) {
    mkdirSync(logDirectory, { recursive: true });
    this.rotateOldLogs();
    this.logFilePath = this.createLogFile();
  }

  /**
   * Записывает сообщение лога через конвейер таймстампа и файлового лога.
   * Поддерживает флаг `--no-time` для подавления префикса таймстампа.
   * @param values - Значения для логирования (строки, объекты или '--no-time')
   */
  log(...values: unknown[]): void {
    this.write(values, false);
  }

  /**
   * Записывает сообщение об ошибке через тот же конвейер таймстампа и файлового лога.
   * @param values - Значения для логирования как ошибка
   */
  error(...values: unknown[]): void {
    this.write(values, true);
  }

  /**
   * Логирует сообщение с префиксом (используется для вывода дочерних процессов).
   * @param message - Сообщение для логирования
   * @param continuationIndent - Отступ для перенесённых строк продолжения
   * @param isError - Логировать ли как ошибку
   */
  logPrefixed(message: string, continuationIndent: number, isError = false): void {
    this.write([message], isError, continuationIndent);
  }

  /**
   * Регистрирует пользовательский парсер для будущих строк логов.
   * @param expression - Регулярное выражение для совпадения
   * @param handler - Функция-обработчик для преобразования совпавших строк
   * @returns this (для цепочки вызовов)
   */
  addParser(expression: RegExp, handler: Parameters<TextParser['addParser']>[1]): this {
    this.textParser.addParser(expression, handler);
    return this;
  }

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
    isError = false,
  ): void {
    this.write([message], isError, continuationIndent, packageName);
  }

  private write(
    values: unknown[],
    isError: boolean,
    continuationIndent = 0,
    packageName?: string,
  ): void {
    const noTime = values.some(value => value === '--no-time');
    const message = values
      .filter(value => value !== '--no-time')
      .map(value =>
        typeof value === 'string'
          ? value
          : util.inspect(value, { colors: true, depth: 6, breakLength: 60, compact: false }),
      )
      .join(' ');
    const indent = ' '.repeat(8);
    const width = Math.max(1, this.getWidth() - indent.length - continuationIndent);
    const lines = message.split('\n').flatMap((line, lineIndex) => {
      const timestampWidth = noTime ? indent.length : 8;
      const parsed = this.textParser.parseLine(line, {
        width: this.getWidth(),
        timestampWidth,
        prefixWidth: timestampWidth + continuationIndent,
        packageName,
      });
      const wrappedLines = parsed.matched
        ? parsed.text.split('\n')
        : wrapAnsi(parsed.text, width, {
            hard: true,
            trim: false,
          }).split('\n');
      return wrappedLines.map((text, wrappedIndex) => ({
        text,
        isContinuation: lineIndex > 0 || wrappedIndex > 0,
      }));
    });
    const timestamp = noTime
      ? ''
      : `${chalk.gray(
          `[${new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}]`,
        )} `;
    const rendered = lines
      .map(
        ({ text, isContinuation }) =>
          `${noTime ? indent : timestamp}${isContinuation ? ' '.repeat(continuationIndent) : ''}${text}`,
      )
      .join('\n');
    this.writeToTerminal(rendered, isError);
    appendFileSync(this.logFilePath, `${rendered.replace(ANSI_PATTERN, '')}\n`, 'utf8');
  }

  private rotateOldLogs(): void {
    const now = Date.now();
    for (const file of readdirSync(this.logDirectory)) {
      const filePath = path.join(this.logDirectory, file);
      const stats = statSync(filePath);
      if (stats.isFile() && now - stats.mtimeMs > LOG_RETENTION_MS) unlinkSync(filePath);
    }
  }

  private createLogFile(): string {
    const files = readdirSync(this.logDirectory);
    const lastIndex = files.reduce((latest, file) => {
      const index = /^(\d+)-/.exec(file)?.[1];
      return index ? Math.max(latest, Number(index)) : latest;
    }, 0);
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8).replaceAll(':', '-');
    const filePath = path.join(this.logDirectory, `${lastIndex + 1}-${date}-${time}.log`);
    writeFileSync(filePath, '', 'utf8');
    return filePath;
  }
}
