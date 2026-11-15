import { t } from '../i18n/index.js';
function normalizeKey(value) {
  return value.replaceAll('\\', '/').replace(/\/+$/, '');
}
/**
 * Координирует выбранные сервисы и обеспечивает, чтобы остановленный сервис
 * прибивал остальные в стеке разработки.
 * Управляет жизненным циклом сервисов, перезапусками и корректным завершением.
 */
export class ServiceSupervisor {
  services;
  isStoppingAll = false;
  shutdownPromise;
  exitCode = 0;
  activeCommands = new Set();
  servicesByKey = new Map();
  manuallyStoppedServices = new Set();
  manuallyStartedServices = new Set();
  knownPackagesByKey = new Map();
  launchContext;
  constructor(services) {
    this.services = services;
    for (const service of services) {
      this.servicesByKey.set(service.package.name, service);
      this.servicesByKey.set(normalizeKey(service.package.relativeDirectory), service);
      this.servicesByKey.set(service.package.name.toLowerCase(), service);
      this.servicesByKey.set(
        normalizeKey(service.package.relativeDirectory).toLowerCase(),
        service,
      );
    }
  }
  /**
   * Возвращает все управляемые сервисы.
   * @returns Массив только для чтения запущенных сервисов
   */
  getServices() {
    return this.services;
  }
  /**
   * Устанавливает контекст запуска для старта новых сервисов.
   * @param context - Контекст запуска с информацией о скрипте, цветах и фабрикой сервисов
   */
  setLaunchContext(context) {
    this.launchContext = context;
    for (const package_ of context.packages) {
      this.knownPackagesByKey.set(package_.name, package_);
      this.knownPackagesByKey.set(normalizeKey(package_.relativeDirectory), package_);
      this.knownPackagesByKey.set(package_.name.toLowerCase(), package_);
      this.knownPackagesByKey.set(normalizeKey(package_.relativeDirectory).toLowerCase(), package_);
    }
  }
  resolveService(target) {
    const key = normalizeKey(target);
    const lowerKey = key.toLowerCase();
    return (
      this.servicesByKey.get(target) ??
      this.servicesByKey.get(key) ??
      this.servicesByKey.get(lowerKey) ??
      [...this.services.values()].find(
        service =>
          service.package.name === target ||
          service.package.relativeDirectory === key ||
          normalizeKey(service.package.relativeDirectory) === key ||
          service.package.name.toLowerCase() === lowerKey ||
          normalizeKey(service.package.relativeDirectory).toLowerCase() === lowerKey,
      )
    );
  }
  resolvePackage(target) {
    const key = normalizeKey(target);
    const lowerKey = key.toLowerCase();
    return (
      this.knownPackagesByKey.get(target) ??
      this.knownPackagesByKey.get(key) ??
      this.knownPackagesByKey.get(lowerKey) ??
      this.launchContext?.packages.find(
        package_ =>
          package_.name === target ||
          package_.relativeDirectory === key ||
          normalizeKey(package_.relativeDirectory) === key ||
          package_.name.toLowerCase() === lowerKey ||
          normalizeKey(package_.relativeDirectory).toLowerCase() === lowerKey,
      )
    );
  }
  /**
   * Запускает все сервисы и ждёт их завершения.
   * Если какой-либо сервис завершается с ненулевым кодом, останавливает все остальные.
   * @returns Код выхода (0 — успех, ненулевое — ошибка)
   */
  async run() {
    const completions = this.services.map(async service => {
      const code = await service.completion;
      if (this.manuallyStoppedServices.has(service)) {
        this.manuallyStoppedServices.delete(service);
        return;
      }
      if (!this.isStoppingAll) {
        if (code !== 0) this.exitCode = code;
        await this.stopAll();
      }
    });
    await Promise.all(completions);
    return this.exitCode;
  }
  /**
   * Корректно останавливает один сервис по имени пакета или относительной директории.
   * @param target - Имя пакета или путь относительной директории
   * @param force - Если true, принудительно убивает процесс немедленно
   * @throws Error если сервис не запущен
   */
  async stopService(target, force = false) {
    if (this.isStoppingAll) return;
    const service = this.resolveService(target);
    if (!service) {
      throw new Error(t('supervisor.serviceNotRunning', { target }));
    }
    if (service.status === 'stopped') return;
    this.manuallyStoppedServices.add(service);
    this.manuallyStartedServices.delete(service);
    await service.stop(force);
  }
  addService(service) {
    this.services.push(service);
    this.servicesByKey.set(service.package.name, service);
    this.servicesByKey.set(normalizeKey(service.package.relativeDirectory), service);
    this.servicesByKey.set(service.package.name.toLowerCase(), service);
    this.servicesByKey.set(normalizeKey(service.package.relativeDirectory).toLowerCase(), service);
  }
  replaceService(oldService, newService) {
    const index = this.services.indexOf(oldService);
    if (index >= 0) {
      this.services[index] = newService;
    } else {
      this.services.push(newService);
    }
    for (const key of [
      oldService.package.name,
      normalizeKey(oldService.package.relativeDirectory),
      oldService.package.name.toLowerCase(),
      normalizeKey(oldService.package.relativeDirectory).toLowerCase(),
    ]) {
      if (this.servicesByKey.get(key) === oldService) {
        this.servicesByKey.delete(key);
      }
    }
    this.servicesByKey.set(newService.package.name, newService);
    this.servicesByKey.set(normalizeKey(newService.package.relativeDirectory), newService);
    this.servicesByKey.set(newService.package.name.toLowerCase(), newService);
    this.servicesByKey.set(
      normalizeKey(newService.package.relativeDirectory).toLowerCase(),
      newService,
    );
  }
  /**
   * Запускает остановленный сервис по имени пакета или относительной директории.
   * @param target - Имя пакета или путь относительной директории
   * @returns Запущенный сервис
   * @throws Error если завершение в процессе, сервис уже запущен, пакет не найден, или контекст запуска не инициализирован
   */
  async startService(target) {
    if (this.isStoppingAll) {
      throw new Error(t('supervisor.cannotStartWhileShuttingDown'));
    }
    const existing = this.resolveService(target);
    if (existing && existing.status !== 'stopped') {
      throw new Error(
        t('supervisor.serviceAlreadyRunning', { serviceName: existing.package.name }),
      );
    }
    const package_ = existing?.package ?? this.resolvePackage(target);
    if (!package_) {
      throw new Error(t('supervisor.packageNotFound', { target }));
    }
    if (!package_.scripts[this.launchContext?.scriptName ?? 'dev']) {
      throw new Error(
        t('supervisor.packageMissingScript', {
          packageName: package_.name,
          scriptName: this.launchContext?.scriptName ?? 'dev',
        }),
      );
    }
    if (!this.launchContext) {
      throw new Error(t('supervisor.launchContextNotInitialized'));
    }
    if (existing && existing.status === 'stopped') {
      this.manuallyStoppedServices.delete(existing);
      this.manuallyStartedServices.delete(existing);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const color = this.launchContext.colors.get(package_) ?? existing.color ?? '#ffffff';
      const service = this.launchContext.startService(
        package_,
        this.launchContext.scriptName,
        this.launchContext.scriptArguments,
        color,
        this.launchContext.output,
      );
      this.replaceService(existing, service);
      this.manuallyStoppedServices.delete(service);
      this.manuallyStartedServices.add(service);
      void this.watchService(service);
      return service;
    }
    const color = this.launchContext.colors.get(package_) ?? '#ffffff';
    const service = this.launchContext.startService(
      package_,
      this.launchContext.scriptName,
      this.launchContext.scriptArguments,
      color,
      this.launchContext.output,
    );
    this.addService(service);
    this.manuallyStoppedServices.delete(service);
    this.manuallyStartedServices.add(service);
    void this.watchService(service);
    return service;
  }
  async watchService(service) {
    const code = await service.completion;
    if (this.manuallyStartedServices.has(service)) {
      this.manuallyStartedServices.delete(service);
      return;
    }
    if (this.manuallyStoppedServices.has(service)) {
      this.manuallyStoppedServices.delete(service);
      return;
    }
    if (!this.isStoppingAll) {
      if (code !== 0) this.exitCode = code;
      await this.stopAll();
    }
  }
  /**
   * Перезапускает один сервис по имени пакета или относительной директории.
   * @param target - Имя пакета или путь относительной директории
   * @param force - Если true, принудительно убивает перед перезапуском
   * @returns Перезапущенный сервис
   * @throws Error если завершение в процессе, сервис не запущен/не найден
   */
  async restartService(target, force = false) {
    if (this.isStoppingAll) {
      throw new Error(t('supervisor.cannotRestartWhileShuttingDown'));
    }
    const service = this.resolveService(target);
    if (!service) {
      throw new Error(t('supervisor.serviceNotRunningOrFound', { target }));
    }
    if (service.status === 'stopped') {
      return this.startService(target);
    }
    this.manuallyStoppedServices.add(service);
    this.manuallyStartedServices.add(service);
    await service.stop(force);
    await service.completion;
    return this.startService(service.package.name);
  }
  /**
   * Перезапускает все текущие запущенные сервисы.
   * @param force - Если true, принудительно убивает перед перезапуском
   * @throws Error если завершение в процессе или нет запущенных сервисов
   */
  async restartAll(force = false) {
    if (this.isStoppingAll) {
      throw new Error(t('supervisor.cannotRestartWhileShuttingDown'));
    }
    const running = this.services.filter(service => service.status !== 'stopped');
    if (running.length === 0) {
      throw new Error(t('supervisor.noRunningServicesToRestart'));
    }
    for (const service of running) {
      this.manuallyStoppedServices.add(service);
      this.manuallyStartedServices.add(service);
    }
    await Promise.all(running.map(service => service.stop(force)));
    await Promise.all(running.map(service => service.completion));
    for (const service of running) {
      await this.startService(service.package.name);
    }
  }
  /**
   * Корректно останавливает все сервисы параллельно, затем принудительно останавливает
   * оставшиеся деревья процессов с использованием платформо-зависимой реализации.
   * Возвращает промис, который разрешается, когда все сервисы остановлены.
   * Последующие вызовы возвращают тот же промис.
   * @returns Промис, разрешающийся при завершении остановки
   */
  stopAll() {
    if (this.shutdownPromise) return this.shutdownPromise;
    this.isStoppingAll = true;
    this.shutdownPromise = Promise.all([
      ...this.services.map(service => service.stop()),
      ...[...this.activeCommands].map(stop => stop()),
    ]).then(() => undefined);
    return this.shutdownPromise;
  }
  /**
   * Регистрирует интерактивную команду пакета для включения в завершение рабочего пространства.
   * @param stop - Функция для остановки команды
   * @returns Функция очистки для отмены регистрации команды
   */
  trackCommand(stop) {
    if (this.isStoppingAll) {
      void stop();
      return () => undefined;
    }
    this.activeCommands.add(stop);
    return () => this.activeCommands.delete(stop);
  }
  /**
   * Принудительно останавливает все сервисы и активные команды немедленно.
   * @returns Промис, разрешающийся когда все сервисы принудительно остановлены
   */
  forceStopAll() {
    this.isStoppingAll = true;
    return Promise.all([
      ...this.services.map(service => service.stop(true)),
      ...[...this.activeCommands].map(stop => stop()),
    ]).then(() => undefined);
  }
}
//# sourceMappingURL=supervisor.js.map
