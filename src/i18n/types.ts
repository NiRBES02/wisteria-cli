/**
 * Брендированный тип для идентификаторов локалей.
 * Обеспечивает безопасность типов при передаче строк локалей во время компиляции.
 */
export type Locale = 'ru-RU' | ('en-US' & { __brand: 'Locale' });

/**
 * Параметры перевода для интерполяции.
 * Значения могут быть строками, числами или undefined (игнорируются в выводе).
 */
export type TranslationParams = Record<string, string | number | undefined>;

/**
 * Тип вложенных ключей для доступа к переводам через точечную нотацию.
 * Поддерживает пути вроде 'logger.started', 'commands.help.description' и т.д.
 * @template T - Тип объекта для извлечения вложенных ключей
 */
export type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

/**
 * Все ключи перевода, производные от русской локали (источник правды).
 * Используется Record<string, unknown> как база, так как точные ключи определены в файлах локалей.
 */
export type TranslationKeys = NestedKeys<Record<string, unknown>>;

/**
 * Структура данных локали с опциональной поддержкой плюрализации.
 * Значения могут быть строками или вложенными объектами для пространственных переводов.
 */
export interface LocaleMessages {
  [key: string]: string | LocaleMessages;
}

/**
 * Конфигурация для загрузки локалей и поведения фолбэков.
 */
export interface LocaleConfig {
  /** Локаль по умолчанию, используемая, когда не указана другая */
  defaultLocale: Locale;
  /** Фолбэк локаль для отсутствующих переводов */
  fallbackLocale: Locale;
  /** Список поддерживаемых идентификаторов локалей */
  availableLocales: Locale[];
}
