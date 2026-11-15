import type { ParsedArguments } from '../runner/types.js';
import type { CommandContext, CommandDefinition, CommandHandler } from './types.js';
import { splitCommandLine } from '../cli/argument-parser.js';

/**
 * Регистрирует имена команд и алиасы, диспетчеризует разобранный ввод консоли.
 * Поддерживает валидацию команд, генерацию справки и разрешение алиасов.
 */
export class CommandRegistry {
  private readonly commands = new Map<string, CommandDefinition>();

  /**
   * Создаёт новый CommandRegistry.
   * @param context - Контекст команды, предоставляющий доступ к сервисам, пакетам и функциям раннера
   */
  constructor(private readonly context: CommandContext) {}

  /**
   * Регистрирует команду. Первое имя — каноническое; остальные — алиасы.
   * @param names - Имя/имена команды как строка, строка через | или массив
   * @param description - Человекочитаемое описание для вывода справки
   * @param handler - Асинхронная функция для выполнения при вызове команды
   * @returns this (для цепочки вызовов)
   * @throws Error если имя не задано, описание пустое или команда уже зарегистрирована
   */
  register(names: string | string[], description: string, handler: CommandHandler): this {
    const parsedNames = (Array.isArray(names) ? names : names.split('|'))
      .map(name => name.trim().toLowerCase())
      .filter(Boolean);
    const [name, ...aliases] = parsedNames;

    if (!name) throw new Error('A command must have at least one name.');
    if (!description.trim()) throw new Error(`Command "${name}" must have a description.`);
    for (const commandName of parsedNames) {
      if (this.commands.has(commandName)) {
        throw new Error(`Command "${commandName}" is already registered.`);
      }
    }

    const definition = { name, aliases, description, handler };
    for (const commandName of parsedNames) this.commands.set(commandName, definition);
    return this;
  }

  /**
   * Удаляет команду и все её алиасы.
   * @param commandName - Каноническое имя или алиас для удаления
   * @returns true если команда найдена и удалена
   */
  unregister(commandName: string): boolean {
    const definition = this.commands.get(commandName.toLowerCase());
    if (!definition) return false;
    for (const name of [definition.name, ...definition.aliases]) this.commands.delete(name);
    return true;
  }

  /**
   * Разрешает команду по её каноническому имени или алиасу.
   * @param commandName - Имя или алиас для поиска
   * @returns Определение команды или undefined если не найдена
   */
  get(commandName: string): CommandDefinition | undefined {
    return this.commands.get(commandName.toLowerCase());
  }

  /**
   * Возвращает каждую зарегистрированную команду один раз, в порядке регистрации.
   * @returns Массив уникальных определений команд
   */
  list(): CommandDefinition[] {
    return [...new Set(this.commands.values())];
  }

  /**
   * Разрешает и выполняет команду, возвращая false при неизвестном имени.
   * @param input - Сырой ввод командной строки
   * @param reportError - Колбэк для сообщения об ошибках выполнения
   * @returns true если команда найдена (независимо от успеха обработчика), false если неизвестна
   */
  async execute(input: string, reportError: (message: string) => void): Promise<boolean> {
    const [commandName, ...arguments_] = splitCommandLine(input);
    if (!commandName) return true;

    const command = this.commands.get(commandName.toLowerCase());
    if (!command) return false;

    try {
      await command.handler(parseCommandArguments(arguments_), this.context);
    } catch (error) {
      reportError(error instanceof Error ? error.message : String(error));
    }
    return true;
  }
}

/**
 * Разбирает длинные и короткие флаги, сохраняя позиционные аргументы.
 * @param arguments_ - Сырые аргументы командной строки
 * @returns Объект разобранных аргументов с флагами, значениями и неизвестными позиционными аргументами
 */
export function parseCommandArguments(arguments_: string[]): ParsedArguments {
  const parsed: ParsedArguments = { flags: {}, values: {}, unknown: [], raw: arguments_ };
  const addValue = (name: string, value: string) => {
    const current = parsed.values[name];
    parsed.values[name] =
      current === undefined
        ? value
        : Array.isArray(current)
          ? [...current, value]
          : [current, value];
  };

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]!;
    if (argument.startsWith('--')) {
      const separator = argument.indexOf('=');
      if (separator !== -1) {
        addValue(argument.slice(2, separator), argument.slice(separator + 1));
        continue;
      }

      const name = argument.slice(2);
      const next = arguments_[index + 1];
      if (next !== undefined && !next.startsWith('-')) {
        addValue(name, next);
        index += 1;
      } else {
        parsed.flags[name] = true;
      }
      continue;
    }

    if (argument.startsWith('-') && argument !== '-') {
      const flags = argument.slice(1);
      if (flags.length === 1) {
        const next = arguments_[index + 1];
        if (next !== undefined && !next.startsWith('-')) {
          addValue(flags, next);
          index += 1;
        } else {
          parsed.flags[flags] = true;
        }
      } else {
        for (const flag of flags) parsed.flags[flag] = true;
      }
      continue;
    }

    parsed.unknown.push(argument);
  }

  return parsed;
}
