import { randomInt } from 'node:crypto';
import type { WorkspacePackage } from '../runner/types.js';

/**
 * Палитра цветов для префиксов вывода пакетов.
 * 8 оттенков выбраны для хорошего визуального разделения.
 */
export const PACKAGE_COLORS = [
  '#00c2a8',
  '#ff7a59',
  '#8a70ff',
  '#e6a700',
  '#ff4d8d',
  '#38a3ff',
  '#9bce4b',
  '#d978ff',
] as const;

/**
 * Назначаёт уникальные цвета пакетам рабочего пространства для идентификации вывода.
 * Перебирает палитру случайно, чтобы избежать повторений.
 * @param packages - Массив пакетов рабочего пространства
 * @returns Map пакет → назначенный hex-цвет
 */
export function assignPackageColors(packages: WorkspacePackage[]): Map<WorkspacePackage, string> {
  const colors = new Map<WorkspacePackage, string>();
  let available = [...PACKAGE_COLORS];

  for (const package_ of packages) {
    if (available.length === 0) available = [...PACKAGE_COLORS];
    const index = randomInt(available.length);
    colors.set(package_, available.splice(index, 1)[0] ?? '#ffffff');
  }

  return colors;
}
