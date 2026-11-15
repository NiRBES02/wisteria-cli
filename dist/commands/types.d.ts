import type { ParsedArguments, RunningService, WorkspacePackage } from '../runner/types.js';
/**
 * Контекст, предоставляемый обработчикам команд при выполнении.
 * Содержит ссылки на запущенные сервисы и методы для их управления.
 */
export interface CommandContext {
  /** Текущие запущенные сервисы */
  services: readonly RunningService[];
  /** Останавливает сервис по имени пакета или все сервисы, если цель не задана */
  stop: (target?: string) => Promise<void>;
  /** Запускает сервис по имени пакета */
  start?: (target: string) => Promise<void>;
  /** Перезапускает сервис по имени пакета или все, если цель не задана */
  restart?: (target?: string) => Promise<void>;
  /** Записывает сообщение в вывод консоли */
  write: (message: string, isError?: boolean) => void;
  /** Запускает команду в конкретном пакете */
  run: (package_: WorkspacePackage, command: string, arguments_: string[]) => Promise<number>;
  /** Все доступные пакеты рабочего пространства */
  packages: WorkspacePackage[];
}
/**
 * Тип сигнатуры для функций-обработчиков команд.
 * Получает разобранные аргументы и контекст команды.
 */
export type CommandHandler = (
  arguments_: ParsedArguments,
  context: CommandContext,
) => void | Promise<void>;
/**
 * Определение зарегистрированной команды.
 */
export interface CommandDefinition {
  /** Основное имя команды */
  name: string;
  /** Альтернативные имена/алиасы для команды */
  aliases: string[];
  /** Человекочитаемое описание, показываемое в справке */
  description: string;
  /** Функция-обработчик, выполняемая при вызове команды */
  handler: CommandHandler;
}
//# sourceMappingURL=types.d.ts.map
