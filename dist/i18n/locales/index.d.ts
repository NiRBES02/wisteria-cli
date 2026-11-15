/**
 * Реестр локалей с ленивой загрузкой.
 * Каждая локаль загружается при первом использовании через динамический импорт.
 * Поддерживает добавление новых локалей путём создания соответствующих .ts файлов и регистрации их здесь.
 */
import type { Locale } from '../types.js';
type LocaleKey = 'ru-RU' | 'en-US';
/**
 * Список доступных кодов локалей.
 * Производится из ключей localeLoadersMap.
 */
export declare const availableLocales: Locale[];
/**
 * Локаль по умолчанию (русский).
 * Используется, когда локаль не указана явно.
 */
export declare const defaultLocale: Locale;
/**
 * Фолбэк локаль (русский).
 * Используется, когда ключ перевода отсутствует в текущей локали.
 */
export declare const fallbackLocale: Locale;
/**
 * Получает загрузчик локали по ключу.
 * @param locale - Ключ локали (без брендинга)
 * @returns Функция загрузчика или undefined если не найдена
 */
export declare function getLocaleLoader(
  locale: LocaleKey,
): (() => Promise<Record<string, unknown>>) | undefined;
/**
 * Проверяет, поддерживается ли локаль.
 * Type guard, сужающий string к типу Locale.
 * @param locale - Строка локали для проверки
 * @returns true если локаль поддерживается, иначе false
 */
export declare function isLocaleSupported(locale: string): locale is Locale;
export {};
//# sourceMappingURL=index.d.ts.map
