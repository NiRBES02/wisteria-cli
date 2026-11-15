/**
 * Публичный API i18n.
 * Экспортирует getLocale(), t(), setLocale() для использования во всём коде.
 *
 * @module i18n
 * @example
 * ```ts
 * import { t, setLocale, getLocale } from './i18n';
 *
 * // Перевод с интерполяцией
 * console.log(t('logger.started', { count: 5, script: 'dev' }));
 *
 * // Смена локали
 * await setLocale('en-US');
 * console.log(t('logger.started', { count: 5, script: 'dev' }));
 * ```
 */
export { getLocale, setLocale, t, loadLocale, clearLocaleCache } from './registry.js';
export {
  availableLocales,
  defaultLocale,
  fallbackLocale,
  isLocaleSupported,
} from './locales/index.js';
//# sourceMappingURL=index.js.map
