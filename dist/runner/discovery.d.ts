import type { WorkspacePackage } from './types.js';
/**
 * Читает глобы пакетов из pnpm-workspace.yaml и возвращает папки,
 * содержащие package.json. Поддерживаются позитивные и `!` паттерны исключения.
 * @param rootDirectory - Абсолютный путь к корню монорепозитория
 * @param scriptName - Опциональное имя скрипта для фильтрации пакетов (возвращать только пакеты с этим скриптом)
 * @returns Массив пакетов рабочего пространства с name, directory и scripts
 * @throws Error если pnpm-workspace.yaml отсутствует или некорректен
 */
export declare function discoverWorkspacePackages(
  rootDirectory: string,
  scriptName?: string,
): Promise<WorkspacePackage[]>;
//# sourceMappingURL=discovery.d.ts.map
