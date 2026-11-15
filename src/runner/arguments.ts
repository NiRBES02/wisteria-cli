import type { RunnerOptions } from './types.js';
import { isLocaleSupported } from '../i18n/locales/index.js';
import { t } from '../i18n/index.js';

/**
 * Разбирает поддерживаемые опции раннера и передаёт аргументы после `--`
 * в каждый выбранный скрипт пакета.
 * @param arguments_ - Аргументы командной строки (process.argv.slice(2))
 * @returns Разобранные опции раннера со скриптом, фильтрами и аргументами скрипта
 * @throws Error при неизвестных опциях или отсутствующих обязательных значениях
 */
export function parseArguments(arguments_: string[]): RunnerOptions {
  const separator = arguments_.indexOf('--');
  const runnerArguments = separator === -1 ? arguments_ : arguments_.slice(0, separator);
  const scriptArguments = separator === -1 ? [] : arguments_.slice(separator + 1);
  const filters: string[] = [];
  let script = 'dev';
  let dryRun = false;
  let locale: RunnerOptions['locale'];

  for (let index = 0; index < runnerArguments.length; index += 1) {
    const argument = runnerArguments[index]!;

    if (argument === '--filter' || argument === '-F') {
      const filter = runnerArguments[index + 1];
      if (!filter || filter.startsWith('-')) {
        throw new Error(t('arguments.optionRequiresFilter', { option: argument }));
      }
      filters.push(filter);
      index += 1;
      continue;
    }

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument.startsWith('--filter=')) {
      const filter = argument.slice('--filter='.length);
      if (!filter) throw new Error(t('arguments.filterRequiresValue'));
      filters.push(filter);
      continue;
    }

    if (argument === '--script' || argument === '-s') {
      const value = runnerArguments[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(t('arguments.optionRequiresScript', { option: argument }));
      }
      script = value;
      index += 1;
      continue;
    }

    if (argument.startsWith('--script=')) {
      script = argument.slice('--script='.length);
      if (!script) throw new Error(t('arguments.scriptRequiresValue'));
      continue;
    }

    if (argument === '--locale' || argument === '-L') {
      const value = runnerArguments[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(t('arguments.optionRequiresLocale', { option: argument }));
      }
      if (!isLocaleSupported(value)) {
        throw new Error(t('arguments.invalidLocale', { locale: value }));
      }
      locale = value as RunnerOptions['locale'];
      index += 1;
      continue;
    }

    if (argument.startsWith('--locale=')) {
      const value = argument.slice('--locale='.length);
      if (!value) throw new Error(t('arguments.localeRequiresValue'));
      if (!isLocaleSupported(value)) {
        throw new Error(t('arguments.invalidLocale', { locale: value }));
      }
      locale = value as RunnerOptions['locale'];
      continue;
    }

    throw new Error(t('arguments.unknownOption', { option: argument }));
  }

  // Fallback to environment variable
  if (
    !locale &&
    process.env['WISTERIA_LOCALE'] &&
    isLocaleSupported(process.env['WISTERIA_LOCALE'])
  ) {
    locale = process.env['WISTERIA_LOCALE'] as RunnerOptions['locale'];
  }

  return { script, filters, scriptArguments, dryRun, locale };
}

/**
 * Совпадает с именами пакетов рабочего пространства и относительными директориями пакетов.
 * Поддерживает точные значения и подстановочный знак `*` в конце.
 */
function matchesFilter(
  package_: { name: string; relativeDirectory: string },
  filter: string,
): boolean {
  const normalizedFilter = filter.replaceAll('\\', '/');
  const candidates = [package_.name, package_.relativeDirectory];
  const pattern = normalizedFilter.endsWith('*')
    ? new RegExp(`^${escapeRegExp(normalizedFilter.slice(0, -1))}.*$`)
    : null;

  return candidates.some(candidate =>
    pattern ? pattern.test(candidate) : candidate === normalizedFilter,
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Применяет позитивные и негативные аргументы `--filter` к обнаруженным пакетам.
 * Без позитивного фильтра выбираются все пакеты перед исключениями.
 * @param packages - Массив пакетов с name и relativeDirectory
 * @param filters - Паттерны фильтров (поддерживает * wildcard и ! для отрицания)
 * @returns Отфильтрованный массив пакетов
 */
export function selectPackages<T extends { name: string; relativeDirectory: string }>(
  packages: T[],
  filters: string[],
): T[] {
  const positiveFilters = filters.filter(filter => !filter.startsWith('!'));
  const negativeFilters = filters
    .filter(filter => filter.startsWith('!'))
    .map(filter => filter.slice(1));

  return packages.filter(package_ => {
    const included =
      positiveFilters.length === 0 ||
      positiveFilters.some(filter => matchesFilter(package_, filter));
    const excluded = negativeFilters.some(filter => matchesFilter(package_, filter));
    return included && !excluded;
  });
}
