import { t } from '../i18n/index.js';
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
export function registerCustomCommands(registry, _context) {
  registry.register('services', t('commandConsole.servicesDescription'), (_arguments, context) => {
    for (const service of context.services) {
      context.write(`${service.package.name}: ${service.status}`);
    }
  });
  registry.register(
    ['install', 'i'],
    t('commandConsole.installDescription'),
    async (arguments_, context) => {
      if (arguments_.unknown.length === 0) throw new Error(t('commandConsole.installUsage'));
      const packages = arguments_.unknown.map(identifier => {
        const normalizedIdentifier = identifier.replaceAll('\\', '/');
        const package_ = context.packages.find(
          candidate =>
            candidate.name === identifier || candidate.relativeDirectory === normalizedIdentifier,
        );
        if (!package_)
          throw new Error(t('commandConsole.packageNotFound', { packageIdentifier: identifier }));
        return package_;
      });
      for (const package_ of packages) {
        context.write(t('commandConsole.installing', { packageName: package_.name }));
        const exitCode = await context.run(package_, 'pnpm', ['install']);
        if (exitCode !== 0)
          throw new Error(
            t('service.installationFailed', { packageName: package_.name, exitCode }),
          );
      }
    },
  );
}
//# sourceMappingURL=custom-commands.js.map
