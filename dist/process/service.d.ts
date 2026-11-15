import type { RunningService, ServiceOutput, WorkspacePackage } from '../runner/types.js';
import type { ServiceSupervisor } from '../runner/supervisor.js';
/**
 * Запускает команду, объявленную скриптом пакета, без добавления процесса
 * менеджера пакетов между раннером и самим приложением.
 * @param package_ - Пакет рабочего пространства, содержащий скрипт
 * @param scriptName - Имя скрипта для запуска (например, 'dev', 'build')
 * @param scriptArguments - Дополнительные аргументы для передачи скрипту
 * @param color - Hex-код цвета для префикса вывода пакета
 * @param output - Колбэк для записи вывода сервиса
 * @returns Экземпляр RunningService со статусом, pid и промисом завершения
 * @throws Error если скрипт не определён в пакете
 */
export declare function startService(
  package_: WorkspacePackage,
  scriptName: string,
  scriptArguments: string[],
  color: string,
  output: ServiceOutput,
): RunningService;
/**
 * Запускает произвольную команду из директории пакета, для интерактивных
 * команд вроде `run api php artisan migrate`.
 * @param package_ - Пакет рабочего пространства для запуска команды
 * @param command - Команда для выполнения
 * @param arguments_ - Аргументы для передачи команде
 * @param output - Колбэк для записи вывода команды
 * @param supervisor - Опциональный супервизор для отслеживания команды при завершении
 * @returns Код выхода команды
 */
export declare function runPackageCommand(
  package_: WorkspacePackage,
  command: string,
  arguments_: string[],
  output: ServiceOutput,
  supervisor?: ServiceSupervisor,
): Promise<number>;
//# sourceMappingURL=service.d.ts.map
