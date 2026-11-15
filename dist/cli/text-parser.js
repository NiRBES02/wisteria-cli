import chalk from 'chalk';
// eslint-disable-next-line no-control-regex
const ANSI_PATTERN = /\u001B\[[0-?]*[ -/]*[@-~]/g;
// eslint-disable-next-line no-control-regex
const ANSI_SEQUENCE_PATTERN = /\u001B\[[0-?]*[ -/]*[@-~]/gy;
/**
 * Применяет зарегистрированные, контекстно-зависимые трансформации к тексту вывода терминала.
 * Поддерживает как regex-обработчики паттернов, так и трансформеры целых строк.
 */
export class TextParser {
  patterns = [];
  /**
   * Регистрирует regex-трансформацию; несовпадающий текст проходит без изменений.
   * @param expression - Регулярное выражение для совпадения
   * @param handler - Функция для трансформации совпавшего текста
   * @returns this (для цепочки вызовов)
   */
  addParser(expression, handler) {
    this.patterns.push({ expression, handler });
    return this;
  }
  /**
   * Регистрирует трансформацию целой строки для пользовательских форматов, требующих парсинга.
   * @param transform - Функция для трансформации целых строк
   * @returns this (для цепочки вызовов)
   */
  addTransformer(transform) {
    this.patterns.push({ transform });
    return this;
  }
  /**
   * Удаляет все зарегистрированные трансформации, соответствующие заданному выражению.
   * @param expression - Регулярное выражение для удаления
   * @returns true, если парсер был удалён
   */
  removeParser(expression) {
    const index = this.patterns.findIndex(
      pattern =>
        'expression' in pattern &&
        pattern.expression.source === expression.source &&
        pattern.expression.flags === expression.flags,
    );
    if (index === -1) return false;
    this.patterns.splice(index, 1);
    return true;
  }
  /**
   * Применяет парсеры в порядке регистрации, иначе возвращает вход без изменений.
   * @param text - Текст для парсинга
   * @param context - Контекст парсера с шириной и информацией о пакете
   * @returns Трансформированный текст
   */
  parse(text, context) {
    return this.parseLine(text, context).text;
  }
  /**
   * Применяет зарегистрированные парсеры и сообщает, совпал ли какой-либо паттерн.
   * @param text - Текст для парсинга
   * @param context - Контекст парсера с шириной и информацией о пакете
   * @returns Объект с трансформированным текстом и флагом совпадения
   */
  parseLine(text, context) {
    return this.patterns.reduce(
      (result, pattern) => {
        const parsed =
          'transform' in pattern
            ? pattern.transform(result.text, context)
            : applyPattern(result.text, pattern, context);
        return { text: parsed.text, matched: result.matched || parsed.matched };
      },
      { text, matched: false },
    );
  }
}
function applyPattern(text, pattern, context) {
  const expression = new RegExp(pattern.expression.source, pattern.expression.flags);
  let output = '';
  let cursor = 0;
  let match = expression.exec(text);
  while (match) {
    const matchIndex = match.index;
    output += text.slice(cursor, matchIndex);
    output += pattern.handler(match, { ...context, text });
    cursor = matchIndex + match[0].length;
    if (!expression.global) break;
    if (match[0].length === 0) expression.lastIndex += 1;
    match = expression.exec(text);
  }
  if (cursor === 0) return { text, matched: false };
  return { text: output + text.slice(cursor), matched: true };
}
/**
 * Регистрирует нормализацию для точек Symfony/PHP консольных запросов.
 * Расширяет `...` до заполнения ширины терминала.
 * @param parser - Экземпляр TextParser для регистрации
 * @returns Тот же парсер (для цепочки вызовов)
 */
export function registerPhpDotParser(parser) {
  return parser.addTransformer((text, context) => {
    const { plainText, rawIndexes } = removeAnsiCodes(text);
    const match = /(\/[^\s]+)\s+(\.{10,})(\s+~\s*[\d.]+\s*ms)?/i.exec(plainText);
    if (!match) return { text, matched: false };
    const pathEnd = match.index + (match[1]?.length ?? 0);
    const rawPathEnd = rawIndexes[pathEnd] ?? text.length;
    const requestLine = text.slice(0, rawPathEnd).replace(/[ \t]+$/, '');
    const suffix = match[3] ?? '';
    const suffixWidth = suffix.replace(ANSI_PATTERN, '').length;
    const requestWidth = requestLine.replace(ANSI_PATTERN, '').length;
    const prefixWidth = context.timestampWidth ?? 0;
    const dotCount = Math.max(0, context.width - prefixWidth - requestWidth - suffixWidth - 2);
    return {
      text: `${requestLine} ${chalk.gray('.'.repeat(dotCount))}${suffix}`,
      matched: true,
    };
  });
}
/**
 * Выравнивает точечные лидеры таблицы миграций Laravel без переноса колонок.
 * Нормализует точечные колонки под ширину терминала.
 * @param parser - Экземпляр TextParser для регистрации
 * @returns Тот же парсер (для цепочки вызовов)
 */
export function registerPhpTableParser(parser) {
  return parser.addTransformer((text, context) => {
    const { plainText, rawIndexes } = removeAnsiCodes(text);
    const header = /Migration name\s+(\.{2,})\s+(Batch\s*\/\s*Status)/i.exec(plainText);
    const row = /(\d{4}_\d{2}_\d{2}_[\w]+)\s+(\.{2,})(\s+\[\d+\]\s+(?:Ran|Pending)\b)/i.exec(
      plainText,
    );
    const match = header ?? row;
    if (!match) return { text, matched: false };
    const dotsGroupIndex = header ? 1 : 2;
    const dots = match[dotsGroupIndex] ?? '';
    const dotsStart = match.index + match[0].indexOf(dots);
    const dotsEnd = dotsStart + dots.length;
    const rawDotsStart = rawIndexes[dotsStart];
    const rawDotsEnd = rawIndexes[dotsEnd] ?? text.length;
    if (rawDotsStart === undefined) return { text, matched: false };
    const prefixWidth = plainText.slice(0, dotsStart).length;
    const suffixWidth = plainText.slice(dotsEnd).length;
    const availableWidth = context.width - (context.timestampWidth ?? 0);
    const dotCount = Math.max(2, availableWidth - prefixWidth - suffixWidth - 1);
    const normalized = `${text.slice(0, rawDotsStart)}${chalk.gray('.'.repeat(dotCount))}${text.slice(rawDotsEnd)}`;
    return { text: normalized, matched: true };
  });
}
function removeAnsiCodes(text) {
  let plainText = '';
  const rawIndexes = [];
  let index = 0;
  while (index < text.length) {
    ANSI_SEQUENCE_PATTERN.lastIndex = index;
    const ansiMatch = ANSI_SEQUENCE_PATTERN.exec(text);
    if (ansiMatch) {
      index = ANSI_SEQUENCE_PATTERN.lastIndex;
      continue;
    }
    const codePoint = text.codePointAt(index);
    if (codePoint === undefined) break;
    const character = String.fromCodePoint(codePoint);
    plainText += character;
    for (const _offset of character) rawIndexes.push(index);
    index += character.length;
  }
  return { plainText, rawIndexes };
}
/**
 * Раскрашивает суффиксы длительности запросов Symfony/PHP без изменения остального текста.
 * Совпадает с паттернами вроде `~ 123.45ms` и раскрашивает длительность.
 * @param parser - Экземпляр TextParser для регистрации
 * @returns Тот же парсер (для цепочки вызовов)
 */
export function registerPhpDurationParser(parser) {
  return parser.addParser(
    /(~\s*)([\d.]+\s*ms)\b/gi,
    match => `${match[1]}${chalk.hex('#f0b429')(match[2] ?? '')}`,
  );
}
//# sourceMappingURL=text-parser.js.map
