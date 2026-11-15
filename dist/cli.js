import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseArguments } from './runner/arguments.js';
import { AppOrchestrator } from './app/orchestrator.js';
const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/**
 * Точка входа CLI.
 * Парсит аргументы командной строки и запускает оркестратор приложения.
 */
async function main() {
  const options = parseArguments(process.argv.slice(2));
  const orchestrator = new AppOrchestrator(rootDirectory);
  process.exitCode = await orchestrator.run(options);
}
main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map
