/**
 * English locale.
 * Translated from the Russian source of truth (ru-RU.ts).
 * Must maintain the same key structure as ru-RU.ts.
 */
declare const _default: {
  readonly banner: {
    readonly project: 'Project';
    readonly version: 'Version';
  };
  readonly signals: {
    readonly stopping: 'Stopping workspace packages ({signal})...';
  };
  readonly orchestrator: {
    readonly noPackagesMatched: 'No workspace packages matched the requested filters and script "{script}".';
    readonly started: 'Started {count} package(s) with script "{script}".';
  };
  readonly processTree: {
    readonly couldNotSendSignal: 'Could not send {signal} to process tree {pid}: {error}';
    readonly couldNotTerminateTaskkill: '[{packageName}] Could not terminate the process tree (taskkill exit code {exitCode}).';
    readonly couldNotTerminate: '[{packageName}] Could not terminate the process tree: {error}';
  };
  readonly launcher: {
    readonly emptyScript: 'Cannot start an empty package script: "{script}".';
    readonly packageMissingScript: 'Package "{packageName}" does not define script "{scriptName}".';
  };
  readonly service: {
    readonly processFailed: '[{packageName}] {message}';
    readonly installationFailed: 'Dependency installation failed in {packageName} (exit code {exitCode}).';
  };
  readonly supervisor: {
    readonly serviceNotRunning: 'Service "{target}" is not running.';
    readonly serviceAlreadyRunning: 'Service "{serviceName}" is already running.';
    readonly packageNotFound: 'Workspace package "{target}" was not found.';
    readonly packageMissingScript: 'Package "{packageName}" does not define script "{scriptName}".';
    readonly launchContextNotInitialized: 'Launch context is not initialized.';
    readonly cannotStartWhileShuttingDown: 'Cannot start services while shutting down.';
    readonly cannotRestartWhileShuttingDown: 'Cannot restart services while shutting down.';
    readonly serviceNotRunningOrFound: 'Service "{target}" is not running or not found.';
    readonly noRunningServicesToRestart: 'No running services to restart.';
  };
  readonly discovery: {
    readonly packagesRequired: 'pnpm-workspace.yaml must declare a "packages" list.';
    readonly noPackagePatterns: 'pnpm-workspace.yaml does not contain any package patterns.';
    readonly packageMustHaveName: 'Package at {manifestPath} must have a non-empty "name".';
    readonly invalidJson: 'Invalid JSON in {manifestPath}: {message}';
  };
  readonly arguments: {
    readonly optionRequiresFilter: 'Option "{option}" requires a package filter.';
    readonly optionRequiresScript: 'Option "{option}" requires a script name.';
    readonly filterRequiresValue: 'Option "--filter" requires a package filter.';
    readonly scriptRequiresValue: 'Option "--script" requires a script name.';
    readonly unknownOption: 'Unknown runner option "{option}".';
    readonly optionRequiresLocale: 'Option "{option}" requires a locale.';
    readonly localeRequiresValue: 'Option "--locale" requires a value.';
    readonly invalidLocale: 'Unsupported locale: "{locale}". Available: ru-RU, en-US.';
  };
  readonly commandConsole: {
    readonly availableCommands: 'Available commands:';
    readonly runUsage: 'Use run <package> <command> [args...] to run a command in a package.';
    readonly startUsage: 'Use start <package>|<path> to start a stopped service.';
    readonly stopUsage: 'Use stop [<package>|<path>] to stop a specific service or all services.';
    readonly restartUsage: 'Use restart [<package>|<path>] to restart a service or all running services.';
    readonly stopAll: 'Stopping workspace services...';
    readonly stoppingService: 'Stopping service "{target}"...';
    readonly serviceStopped: 'Service "{target}" stopped.';
    readonly serviceStarted: 'Service "{serviceName}" started.';
    readonly serviceRestarted: 'Service "{serviceName}" restarted.';
    readonly allServicesRestarted: 'All running services restarted.';
    readonly startUsageError: 'Usage: start <package>|<path>';
    readonly startNotAvailable: 'Start is not available in this session.';
    readonly runUsageError: 'Usage: run <package> <command> [args...]';
    readonly packageNotFound: 'Workspace package "{packageIdentifier}" was not found.';
    readonly commandExited: '{command} exited with code {exitCode}.';
    readonly commandFailed: 'Command failed: {message}';
    readonly unknownCommand: 'Unknown command: {command}';
    readonly stopDescription: 'Stop all workspace services or a specific one: stop [<package>|<path>]';
    readonly startDescription: 'Start a stopped service: start <package>|<path>';
    readonly restartDescription: 'Restart a service or all running services: restart [<package>|<path>]';
    readonly statusDescription: 'Show running service status';
    readonly runDescription: 'Run a command in a workspace package';
    readonly helpDescription: 'List available commands';
    readonly servicesDescription: 'Show service status';
    readonly installDescription: 'Run pnpm install in named packages';
    readonly installUsage: 'Usage: install <package> [package...]';
    readonly installing: 'Installing dependencies in {packageName}...';
  };
  readonly logger: {};
  readonly cli: {};
  readonly common: {
    readonly error: 'Error';
    readonly warning: 'Warning';
    readonly info: 'Info';
    readonly success: 'Success';
    readonly yes: 'Yes';
    readonly no: 'No';
    readonly or: 'or';
    readonly and: 'and';
  };
  readonly plural: {
    readonly package: {
      readonly one: 'package';
      readonly other: 'packages';
    };
    readonly service: {
      readonly one: 'service';
      readonly other: 'services';
    };
  };
};
export default _default;
//# sourceMappingURL=en-US.d.ts.map
