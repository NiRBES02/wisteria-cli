import type { Locale, LocaleMessages, TranslationParams } from './types.js';
/**
 * Устанавливает текущую локаль и загружает её, если не в кэше.
 * @param locale - Локаль для установки (должна быть поддерживаемой)
 * @throws Error если локаль не поддерживается
 */
export declare function setLocale(locale: Locale): Promise<void>;
/**
 * Получает текущую активную локаль.
 * @returns Идентификатор текущей локали
 */
export declare function getLocale(): Locale;
/**
 * Загружает сообщения локали в кэш.
 * Использует ленивую загрузку — локаль загружается при первом обращении и кэшируется.
 * При ошибке загрузки откатывается к локали по умолчанию.
 * @param locale - Локаль для загрузки
 * @returns Объект загруженных сообщений локали
 * @throws Error если локаль не поддерживается или фолбэк тоже упал
 */
export declare function loadLocale(locale: Locale): Promise<LocaleMessages>;
/**
 * Переводит ключ с опциональными параметрами и поддержкой плюрализации.
 * Поддерживает:
 * - Простую интерполяцию: t('key', { name: 'value' })
 * - Плюрализацию: t('key', { count: 5 }) использует key_one/key_few/key_many (русский) или key_one/key_other (английский)
 * - Цепочку фолбэков: текущая локаль → фолбэк локаль → сам ключ
 * @param key - Ключ перевода (например, 'logger.started')
 * @param params - Опциональные параметры для интерполяции и плюрализации (count для плюрализации)
 * @returns Переведённая и интерполированная строка
 */
export declare function t(key: string, params?: TranslationParams): string;
/**
 * Очищает кэш локалей (полезно для тестирования).
 */
export declare function clearLocaleCache(): void;
//# sourceMappingURL=registry.d.ts.map
