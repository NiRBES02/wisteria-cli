import type { PackageManifest } from '../runner/types.js';
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
