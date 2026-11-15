import type { WorkspacePackage } from '../runner/types.js';
/**
 * Палитра цветов для префиксов вывода пакетов.
 * 8 оттенков выбраны для хорошего визуального разделения.
 */
export declare const PACKAGE_COLORS: readonly [
  '#00c2a8',
  '#ff7a59',
  '#8a70ff',
  '#e6a700',
  '#ff4d8d',
  '#38a3ff',
  '#9bce4b',
  '#d978ff',
];
/**
 * Назначаёт уникальные цвета пакетам рабочего пространства для идентификации вывода.
 * Перебирает палитру случайно, чтобы избежать повторений.
 * @param packages - Массив пакетов рабочего пространства
 * @returns Map пакет → назначенный hex-цвет
 */
export declare function assignPackageColors(
  packages: WorkspacePackage[],
): Map<WorkspacePackage, string>;
//# sourceMappingURL=colors.d.ts.map
