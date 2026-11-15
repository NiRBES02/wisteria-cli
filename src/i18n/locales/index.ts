/**
 * Реестр локалей с ленивой загрузкой.
 * Каждая локаль загружается при первом использовании через динамический импорт.
 * Поддерживает добавление новых локалей путём создания соответствующих .ts файлов и регистрации их здесь.
 */

import type { Locale } from '../types.js';

// Internal type for locale loader keys (without branding for Record compatibility)
type LocaleKey = 'ru-RU' | 'en-US';

/**
 * Доступные локали и их загрузчики.
 * Добавляйте новые локали сюда и создавайте соответствующие .ts файлы в этой директории.
 * Каждый загрузчик — это динамический импорт, возвращающий объект сообщений локали.
 */
const localeLoadersMap: Record<LocaleKey, () => Promise<Record<string, unknown>>> = {
  'ru-RU': () => import('./ru-RU.js'),
  'en-US': () => import('./en-US.js'),
};

/**
 * Список доступных кодов локалей.
 * Производится из ключей localeLoadersMap.
 */
export const availableLocales: Locale[] = Object.keys(localeLoadersMap) as Locale[];

/**
 * Локаль по умолчанию (русский).
 * Используется, когда локаль не указана явно.
 */
export const defaultLocale: Locale = 'ru-RU';

/**
 * Фолбэк локаль (русский).
 * Используется, когда ключ перевода отсутствует в текущей локали.
 */
export const fallbackLocale: Locale = 'ru-RU';

/**
 * Получает загрузчик локали по ключу.
 * @param locale - Ключ локали (без брендинга)
 * @returns Функция загрузчика или undefined если не найдена
 */
export function getLocaleLoader(
  locale: LocaleKey,
): (() => Promise<Record<string, unknown>>) | undefined {
  return localeLoadersMap[locale];
}

/**
 * Проверяет, поддерживается ли локаль.
 * Type guard, сужающий string к типу Locale.
 * @param locale - Строка локали для проверки
 * @returns true если локаль поддерживается, иначе false
 */
export function isLocaleSupported(locale: string): locale is Locale {
  return locale in localeLoadersMap;
}
