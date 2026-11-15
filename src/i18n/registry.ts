import type { Locale, LocaleMessages, TranslationParams } from './types.js';
import { getLocaleLoader, fallbackLocale } from './locales/index.js';

/** Кэш загруженных сообщений локалей. */
const localeCache = new Map<Locale, LocaleMessages>();

/** Текущая активная локаль. */
let currentLocale: Locale = 'ru-RU';

/** Локаль фолбэка по умолчанию. */
const FALLBACK_LOCALE: Locale = fallbackLocale;

/**
 * Устанавливает текущую локаль и загружает её, если не в кэше.
 * @param locale - Локаль для установки (должна быть поддерживаемой)
 * @throws Error если локаль не поддерживается
 */
export async function setLocale(locale: Locale): Promise<void> {
  const loader = getLocaleLoader(locale as 'ru-RU' | 'en-US');
  if (!loader) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  currentLocale = locale;
  await loadLocale(locale);
}

/**
 * Получает текущую активную локаль.
 * @returns Идентификатор текущей локали
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Загружает сообщения локали в кэш.
 * Использует ленивую загрузку — локаль загружается при первом обращении и кэшируется.
 * При ошибке загрузки откатывается к локали по умолчанию.
 * @param locale - Локаль для загрузки
 * @returns Объект загруженных сообщений локали
 * @throws Error если локаль не поддерживается или фолбэк тоже упал
 */
export async function loadLocale(locale: Locale): Promise<LocaleMessages> {
  if (localeCache.has(locale)) {
    return localeCache.get(locale)!;
  }

  const loader = getLocaleLoader(locale as 'ru-RU' | 'en-US');
  if (!loader) {
    throw new Error(`No loader for locale: ${locale}`);
  }

  try {
    const module = (await loader()) as { default?: LocaleMessages } & LocaleMessages;
    const messages = module['default'] ?? module;
    localeCache.set(locale, messages);
    return messages;
  } catch (error) {
    if (locale !== FALLBACK_LOCALE) {
      console.warn(`Failed to load locale ${locale}, falling back to ${FALLBACK_LOCALE}`);
      return loadLocale(FALLBACK_LOCALE);
    }
    throw error;
  }
}

/**
 * Разрешает вложенный ключ в объекте сообщений локали через точечную нотацию.
 * @param messages - Объект сообщений локали
 * @param key - Ключ в точечной нотации (например, 'logger.started')
 * @returns Разрешённая строка или undefined если не найдена
 */
function resolveKey(messages: LocaleMessages, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = messages;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Интерполирует параметры в строку перевода.
 * Заменяет паттерны {placeholder} на соответствующие значения из params.
 * @param template - Шаблон перевода с {плейсхолдерами}
 * @param params - Параметры для интерполяции
 * @returns Интерполированная строка
 */
function interpolate(template: string, params: TranslationParams): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    return value !== undefined ? String(value) : match;
  });
}

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
export function t(key: string, params?: TranslationParams): string {
  const messages = localeCache.get(currentLocale);

  if (!messages) {
    // Locale not loaded yet, try to load it synchronously (will be async in practice)
    // For now, return the key as fallback
    console.warn(`Locale ${currentLocale} not loaded, returning key: ${key}`);
    return key;
  }

  let translation = resolveKey(messages, key);

  // Fallback to default locale if key not found
  if (translation === undefined && currentLocale !== FALLBACK_LOCALE) {
    const fallbackMessages = localeCache.get(FALLBACK_LOCALE);
    if (fallbackMessages) {
      translation = resolveKey(fallbackMessages, key);
    }
  }

  // Ultimate fallback: return the key itself
  if (translation === undefined) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  // Handle pluralization: if params.count exists, try key_one, key_few, key_many
  if (params && typeof params['count'] === 'number') {
    const count = params['count'] as number;
    let pluralKey: string;

    // Simplified pluralization rules for Russian and English
    if (currentLocale === 'ru-RU') {
      // Russian pluralization: one (1), few (2-4), many (5+)
      if (count % 10 === 1 && count % 100 !== 11) {
        pluralKey = `${key}_one`;
      } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        pluralKey = `${key}_few`;
      } else {
        pluralKey = `${key}_many`;
      }
    } else {
      // English pluralization: one (1), other (0, 2+)
      pluralKey = count === 1 ? `${key}_one` : `${key}_other`;
    }

    const pluralTranslation = resolveKey(messages, pluralKey);
    if (pluralTranslation !== undefined) {
      translation = pluralTranslation;
    }
  }

  // Interpolate parameters
  if (params) {
    translation = interpolate(translation, params);
  }

  return translation;
}

/**
 * Очищает кэш локалей (полезно для тестирования).
 */
export function clearLocaleCache(): void {
  localeCache.clear();
}
