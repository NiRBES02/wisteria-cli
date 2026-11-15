import type { RunnerOptions } from '../runner/types.js';
/**
 * Основной оркестратор приложения Wisteria CLI.
 * Координирует обнаружение пакетов, супервизор сервисов и интерактивную консоль команд.
 *
 * @example
 * ```ts
 * const orchestrator = new AppOrchestrator('/path/to/monorepo');
 * const exitCode = await orchestrator.run({ script: 'dev', filters: ['apps/*'] });
 * ```
 */
export declare class AppOrchestrator {
  private readonly rootDirectory;
  /**
   * Создаёт новый экземпляр AppOrchestrator.
   * @param rootDirectory - Абсолютный путь к корневой директории монорепозитория (содержит pnpm-workspace.yaml)
   */
  constructor(rootDirectory: string);
  /**
   * Запускает стек разработки для выбранных пакетов рабочего пространства.
   * @param options - Опции раннера: имя скрипта, фильтры, режим сухого запуска
   * @returns Код выхода (0 — успех, ненулевое значение — ошибка)
   */
  run(options: RunnerOptions): Promise<number>;
}
//# sourceMappingURL=orchestrator.d.ts.map
