import type { RunnerOptions } from './types.js';
/**
 * Разбирает поддерживаемые опции раннера и передаёт аргументы после `--`
 * в каждый выбранный скрипт пакета.
 * @param arguments_ - Аргументы командной строки (process.argv.slice(2))
 * @returns Разобранные опции раннера со скриптом, фильтрами и аргументами скрипта
 * @throws Error при неизвестных опциях или отсутствующих обязательных значениях
 */
export declare function parseArguments(arguments_: string[]): RunnerOptions;
/**
 * Применяет позитивные и негативные аргументы `--filter` к обнаруженным пакетам.
 * Без позитивного фильтра выбираются все пакеты перед исключениями.
 * @param packages - Массив пакетов с name и relativeDirectory
 * @param filters - Паттерны фильтров (поддерживает * wildcard и ! для отрицания)
 * @returns Отфильтрованный массив пакетов
 */
export declare function selectPackages<
  T extends {
    name: string;
    relativeDirectory: string;
  },
>(packages: T[], filters: string[]): T[];
//# sourceMappingURL=arguments.d.ts.map
