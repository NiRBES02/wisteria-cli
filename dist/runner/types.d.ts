import type { Locale } from '../i18n/types.js';
/**
 * Минимальная структура манифеста package.json для чтения информации корневого пакета.
 */
export interface PackageManifest {
  /** Имя пакета */
  name?: string;
  /** Версия пакета */
  version?: string;
  /** Используемый менеджер пакетов (например, "pnpm", "npm", "yarn") */
  packageManager?: string;
  /** Скрипты, определённые в package.json */
  scripts?: Record<string, string | undefined>;
}
/**
 * Представляет обнаруженный пакет рабочего пространства.
 */
export interface WorkspacePackage {
  /** Имя пакета из package.json */
  name: string;
  /** Абсолютный путь к директории пакета */
  directory: string;
  /** Относительный путь от корня монорепозитория */
  relativeDirectory: string;
  /** Доступные npm скрипты */
  scripts: Record<string, string>;
}
/**
 * Структура разобранных аргументов командной строки.
 */
export interface ParsedArguments {
  /** Булевы флаги (например, --verbose => { verbose: true }) */
  flags: Record<string, boolean>;
  /** Опции «ключ-значение» (например, --port=3000 => { port: '3000' }) */
  values: Record<string, string | string[]>;
  /** Позиционные/неизвестные аргументы */
  unknown: string[];
  /** Исходные сырой аргументы */
  raw: string[];
}
/**
 * Опции конфигурации раннера.
 */
export interface RunnerOptions {
  /** Имя скрипта для запуска (например, "dev", "build") */
  script: string;
  /** Паттерны фильтров пакетов (поддерживает * wildcard и ! отрицание) */
  filters: string[];
  /** Аргументы, переданные после разделителя -- */
  scriptArguments: string[];
  /** Если true, только выводит что будет выполнено без запуска */
  dryRun: boolean;
  /** Локаль для i18n (например, 'ru-RU', 'en-US') */
  locale: Locale | undefined;
}
/**
 * Представляет запущенный сервис/процесс для пакета рабочего пространства.
 */
export interface RunningService {
  /** Пакет рабочего пространства, которому принадлежит этот сервис */
  package: WorkspacePackage;
  /** Назначенный цвет для префикса вывода */
  color: string;
  /** Текущий статус сервиса */
  readonly status: 'running' | 'stopping' | 'stopped';
  /** ID процесса, если запущен */
  readonly pid: number | undefined;
  /** Останавливает сервис корректно или принудительно */
  stop: (force?: boolean) => Promise<void>;
  /** Промис, разрешающийся с кодом выхода при завершении процесса */
  completion: Promise<number>;
}
/**
 * Опции для форматирования вывода сервиса.
 */
export interface ServiceOutputOptions {
  /** Отступ для строк продолжения */
  continuationIndent: number;
  /** Имя пакета для префикса */
  packageName: string;
}
/**
 * Тип колбэка для обработки вывода сервиса.
 * @param message - Сообщение вывода
 * @param isError - Является ли сообщение из stderr
 * @param options - Опции форматирования
 */
export type ServiceOutput = (
  message: string,
  isError: boolean,
  options?: ServiceOutputOptions,
) => void;
//# sourceMappingURL=types.d.ts.map
