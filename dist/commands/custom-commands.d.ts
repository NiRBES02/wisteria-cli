import type { CommandRegistry } from './command-registry.js';
import type { CommandContext } from './types.js';
/**
 * Регистрирует проект-специфичные интерактивные команды.
 * Эта функция — точка расширения для добавления пользовательских команд в интерактивную консоль.
 * @param registry - Реестр команд для регистрации
 * * @param _context - Контекст команды (не используется, но доступен для будущих расширений)
 * @example
 * ```ts
 * registry.register('services', 'List running services', (_arguments, context) => {
 *   for (const service of context.services) {
 *     context.write(`${service.package.name}: ${service.status}`);
 *   }
 * });
 * ```
 */
export declare function registerCustomCommands(
  registry: CommandRegistry,
  _context: CommandContext,
): void;
//# sourceMappingURL=custom-commands.d.ts.map
