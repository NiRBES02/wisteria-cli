/**
 * Контекст, предоставляемый текстовым парсерам и трансформерам.
 */
export interface TextParserContext {
  /** Ширина терминала в символах */
  width: number;
  /** Опциональное имя пакета для цветового кодирования */
  packageName: string | undefined;
  /** Ширина префикса (таймстамп + отступ продолжения) */
  prefixWidth?: number;
  /** Ширина части таймстампа */
  timestampWidth?: number;
}
/**
 * Функция-обработчик для совпадений текстовых паттернов.
 */
export type TextPatternHandler = (
  match: RegExpExecArray,
  context: TextParserContext & {
    text: string;
  },
) => string;
interface TextTransformer {
  transform: (
    text: string,
    context: TextParserContext,
  ) => {
    text: string;
    matched: boolean;
  };
}
/**
 * Применяет зарегистрированные, контекстно-зависимые трансформации к тексту вывода терминала.
 * Поддерживает как regex-обработчики паттернов, так и трансформеры целых строк.
 */
export declare class TextParser {
  private readonly patterns;
  /**
   * Регистрирует regex-трансформацию; несовпадающий текст проходит без изменений.
   * @param expression - Регулярное выражение для совпадения
   * @param handler - Функция для трансформации совпавшего текста
   * @returns this (для цепочки вызовов)
   */
  addParser(expression: RegExp, handler: TextPatternHandler): this;
  /**
   * Регистрирует трансформацию целой строки для пользовательских форматов, требующих парсинга.
   * @param transform - Функция для трансформации целых строк
   * @returns this (для цепочки вызовов)
   */
  addTransformer(transform: TextTransformer['transform']): this;
  /**
   * Удаляет все зарегистрированные трансформации, соответствующие заданному выражению.
   * @param expression - Регулярное выражение для удаления
   * @returns true, если парсер был удалён
   */
  removeParser(expression: RegExp): boolean;
  /**
   * Применяет парсеры в порядке регистрации, иначе возвращает вход без изменений.
   * @param text - Текст для парсинга
   * @param context - Контекст парсера с шириной и информацией о пакете
   * @returns Трансформированный текст
   */
  parse(text: string, context: TextParserContext): string;
  /**
   * Применяет зарегистрированные парсеры и сообщает, совпал ли какой-либо паттерн.
   * @param text - Текст для парсинга
   * @param context - Контекст парсера с шириной и информацией о пакете
   * @returns Объект с трансформированным текстом и флагом совпадения
   */
  parseLine(
    text: string,
    context: TextParserContext,
  ): {
    text: string;
    matched: boolean;
  };
}
/**
 * Регистрирует нормализацию для точек Symfony/PHP консольных запросов.
 * Расширяет `...` до заполнения ширины терминала.
 * @param parser - Экземпляр TextParser для регистрации
 * @returns Тот же парсер (для цепочки вызовов)
 */
export declare function registerPhpDotParser(parser: TextParser): TextParser;
/**
 * Выравнивает точечные лидеры таблицы миграций Laravel без переноса колонок.
 * Нормализует точечные колонки под ширину терминала.
 * @param parser - Экземпляр TextParser для регистрации
 * @returns Тот же парсер (для цепочки вызовов)
 */
export declare function registerPhpTableParser(parser: TextParser): TextParser;
/**
 * Раскрашивает суффиксы длительности запросов Symfony/PHP без изменения остального текста.
 * Совпадает с паттернами вроде `~ 123.45ms` и раскрашивает длительность.
 * @param parser - Экземпляр TextParser для регистрации
 * @returns Тот же парсер (для цепочки вызовов)
 */
export declare function registerPhpDurationParser(parser: TextParser): TextParser;
export {};
//# sourceMappingURL=text-parser.d.ts.map
