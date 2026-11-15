import { parseArguments } from './runner/arguments.js';
import { AppOrchestrator } from './app/orchestrator.js';
import { findWorkspaceRoot } from './app/utils.js';
/**
 * Точка входа CLI.
 * Парсит аргументы командной строки и запускает оркестратор приложения.
 */
async function main() {
  const options = parseArguments(process.argv.slice(2));
  // Находим корень рабочего пространства от текущей рабочей директории
  const workspaceRoot = await findWorkspaceRoot();
  if (!workspaceRoot) {
    console.error(
      'Error: No pnpm-workspace.yaml found in current directory or any parent directory.',
    );
    console.error('Run wisteria from within a pnpm workspace.');
    process.exitCode = 1;
    return;
  }
  const orchestrator = new AppOrchestrator(workspaceRoot);
  process.exitCode = await orchestrator.run(options);
}
main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map
