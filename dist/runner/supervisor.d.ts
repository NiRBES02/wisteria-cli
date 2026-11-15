import type { RunningService, ServiceOutput, WorkspacePackage } from './types.js';
interface LaunchContext {
  scriptName: string;
  scriptArguments: string[];
  colors: Map<WorkspacePackage, string>;
  output: ServiceOutput;
  packages: WorkspacePackage[];
  startService: (
    package_: WorkspacePackage,
    scriptName: string,
    scriptArguments: string[],
    color: string,
    output: ServiceOutput,
  ) => RunningService;
}
/**
 * Координирует выбранные сервисы и обеспечивает, чтобы остановленный сервис
 * прибивал остальные в стеке разработки.
 * Управляет жизненным циклом сервисов, перезапусками и корректным завершением.
 */
export declare class ServiceSupervisor {
  private readonly services;
  private isStoppingAll;
  private shutdownPromise;
  private exitCode;
  private readonly activeCommands;
  private readonly servicesByKey;
  private readonly manuallyStoppedServices;
  private readonly manuallyStartedServices;
  private readonly knownPackagesByKey;
  private launchContext;
  constructor(services: RunningService[]);
  /**
   * Возвращает все управляемые сервисы.
   * @returns Массив только для чтения запущенных сервисов
   */
  getServices(): readonly RunningService[];
  /**
   * Устанавливает контекст запуска для старта новых сервисов.
   * @param context - Контекст запуска с информацией о скрипте, цветах и фабрикой сервисов
   */
  setLaunchContext(context: LaunchContext): void;
  private resolveService;
  private resolvePackage;
  /**
   * Запускает все сервисы и ждёт их завершения.
   * Если какой-либо сервис завершается с ненулевым кодом, останавливает все остальные.
   * @returns Код выхода (0 — успех, ненулевое — ошибка)
   */
  run(): Promise<number>;
  /**
   * Корректно останавливает один сервис по имени пакета или относительной директории.
   * @param target - Имя пакета или путь относительной директории
   * @param force - Если true, принудительно убивает процесс немедленно
   * @throws Error если сервис не запущен
   */
  stopService(target: string, force?: boolean): Promise<void>;
  private addService;
  private replaceService;
  /**
   * Запускает остановленный сервис по имени пакета или относительной директории.
   * @param target - Имя пакета или путь относительной директории
   * @returns Запущенный сервис
   * @throws Error если завершение в процессе, сервис уже запущен, пакет не найден, или контекст запуска не инициализирован
   */
  startService(target: string): Promise<RunningService>;
  private watchService;
  /**
   * Перезапускает один сервис по имени пакета или относительной директории.
   * @param target - Имя пакета или путь относительной директории
   * @param force - Если true, принудительно убивает перед перезапуском
   * @returns Перезапущенный сервис
   * @throws Error если завершение в процессе, сервис не запущен/не найден
   */
  restartService(target: string, force?: boolean): Promise<RunningService>;
  /**
   * Перезапускает все текущие запущенные сервисы.
   * @param force - Если true, принудительно убивает перед перезапуском
   * @throws Error если завершение в процессе или нет запущенных сервисов
   */
  restartAll(force?: boolean): Promise<void>;
  /**
   * Корректно останавливает все сервисы параллельно, затем принудительно останавливает
   * оставшиеся деревья процессов с использованием платформо-зависимой реализации.
   * Возвращает промис, который разрешается, когда все сервисы остановлены.
   * Последующие вызовы возвращают тот же промис.
   * @returns Промис, разрешающийся при завершении остановки
   */
  stopAll(): Promise<void>;
  /**
   * Регистрирует интерактивную команду пакета для включения в завершение рабочего пространства.
   * @param stop - Функция для остановки команды
   * @returns Функция очистки для отмены регистрации команды
   */
  trackCommand(stop: () => Promise<void>): () => void;
  /**
   * Принудительно останавливает все сервисы и активные команды немедленно.
   * @returns Промис, разрешающийся когда все сервисы принудительно остановлены
   */
  forceStopAll(): Promise<void>;
}
export {};
//# sourceMappingURL=supervisor.d.ts.map
