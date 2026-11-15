/**
 * Разбивает строку командной строки на аргументы, учитывая пробелы в кавычках.
 * Поддерживает одинарные и двойные кавычки, с экранированием внутри двойных кавычек.
 * @param input - Строка командной строки для разбора
 * @returns Массив разобранных аргументов
 * @throws Error если кавычка не закрыта
 */
export function splitCommandLine(input) {
  const tokens = [];
  let token = '';
  let tokenStarted = false;
  let quote;
  let escaped = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index] ?? '';
    if (escaped) {
      token += character;
      tokenStarted = true;
      escaped = false;
    } else if (character === '\\' && quote !== "'" && /["'\\\s]/.test(input[index + 1] ?? '')) {
      escaped = true;
    } else if (quote) {
      if (character === quote) quote = undefined;
      else token += character;
      tokenStarted = true;
    } else if (character === '"' || character === "'") {
      quote = character;
      tokenStarted = true;
    } else if (/\s/.test(character)) {
      if (tokenStarted) tokens.push(token);
      token = '';
      tokenStarted = false;
    } else {
      token += character;
      tokenStarted = true;
    }
  }
  if (escaped) token += '\\';
  if (quote) throw new Error('Unclosed quote in command input.');
  if (tokenStarted) tokens.push(token);
  return tokens;
}
//# sourceMappingURL=argument-parser.js.map
