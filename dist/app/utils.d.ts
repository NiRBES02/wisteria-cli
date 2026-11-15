import type { PackageManifest } from '../runner/types.js';
/**
 * Находит корень рабочего пространства, ища pnpm-workspace.yaml
 * начиная с указанной директории и поднимаясь вверх по дереву.
 * @param startDir - Директория для начала поиска (по умолчанию: process.cwd())
 * @returns Абсолютный путь к корню рабочего пространства или null, если не найден
 */
export declare function findWorkspaceRoot(startDir?: string): Promise<string | null>;
/**
 * Читает манифест корневого package.json.
 * @param root - Абсолютный путь к корню монорепозитория
 * @returns Разобранный манифест пакета
 */
export declare function readRootManifest(root: string): Promise<PackageManifest>;
/**
 * Форматирует команду с дополнительными аргументами для отображения.
 * Раскрашивает имя команды и аргументы.
 * @param script - Исходная строка скрипта из package.json
 * @param extraArguments - Дополнительные аргументы для добавления
 * @returns Отформатированная цветом строка команды
 */
export declare function formatCommand(script: string, extraArguments: string[]): string;
//# sourceMappingURL=utils.d.ts.map
