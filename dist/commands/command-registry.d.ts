import type { ParsedArguments } from '../runner/types.js';
import type { CommandContext, CommandDefinition, CommandHandler } from './types.js';
/**
 * Регистрирует имена команд и алиасы, диспетчеризует разобранный ввод консоли.
 * Поддерживает валидацию команд, генерацию справки и разрешение алиасов.
 */
export declare class CommandRegistry {
  private readonly context;
  private readonly commands;
  /**
   * Создаёт новый CommandRegistry.
   * @param context - Контекст команды, предоставляющий доступ к сервисам, пакетам и функциям раннера
   */
  constructor(context: CommandContext);
  /**
   * Регистрирует команду. Первое имя — каноническое; остальные — алиасы.
   * @param names - Имя/имена команды как строка, строка через | или массив
   * @param description - Человекочитаемое описание для вывода справки
   * @param handler - Асинхронная функция для выполнения при вызове команды
   * @returns this (для цепочки вызовов)
   * @throws Error если имя не задано, описание пустое или команда уже зарегистрирована
   */
  register(names: string | string[], description: string, handler: CommandHandler): this;
  /**
   * Удаляет команду и все её алиасы.
   * @param commandName - Каноническое имя или алиас для удаления
   * @returns true если команда найдена и удалена
   */
  unregister(commandName: string): boolean;
  /**
   * Разрешает команду по её каноническому имени или алиасу.
   * @param commandName - Имя или алиас для поиска
   * @returns Определение команды или undefined если не найдена
   */
  get(commandName: string): CommandDefinition | undefined;
  /**
   * Возвращает каждую зарегистрированную команду один раз, в порядке регистрации.
   * @returns Массив уникальных определений команд
   */
  list(): CommandDefinition[];
  /**
   * Разрешает и выполняет команду, возвращая false при неизвестном имени.
   * @param input - Сырой ввод командной строки
   * @param reportError - Колбэк для сообщения об ошибках выполнения
   * @returns true если команда найдена (независимо от успеха обработчика), false если неизвестна
   */
  execute(input: string, reportError: (message: string) => void): Promise<boolean>;
}
/**
 * Разбирает длинные и короткие флаги, сохраняя позиционные аргументы.
 * @param arguments_ - Сырые аргументы командной строки
 * @returns Объект разобранных аргументов с флагами, значениями и неизвестными позиционными аргументами
 */
export declare function parseCommandArguments(arguments_: string[]): ParsedArguments;
//# sourceMappingURL=command-registry.d.ts.map
