/**
 * English locale.
 * Translated from the Russian source of truth (ru-RU.ts).
 * Must maintain the same key structure as ru-RU.ts.
 */
export default {
  // Banner
  banner: {
    project: 'Project',
    version: 'Version',
  },
  // Signals
  signals: {
    stopping: 'Stopping workspace packages ({signal})...',
  },
  // Orchestrator
  orchestrator: {
    noPackagesMatched: 'No workspace packages matched the requested filters and script "{script}".',
    started: 'Started {count} package(s) with script "{script}".',
  },
  // Process tree
  processTree: {
    couldNotSendSignal: 'Could not send {signal} to process tree {pid}: {error}',
    couldNotTerminateTaskkill:
      '[{packageName}] Could not terminate the process tree (taskkill exit code {exitCode}).',
    couldNotTerminate: '[{packageName}] Could not terminate the process tree: {error}',
  },
  // Launcher
  launcher: {
    emptyScript: 'Cannot start an empty package script: "{script}".',
    packageMissingScript: 'Package "{packageName}" does not define script "{scriptName}".',
  },
  // Service
  service: {
    processFailed: '[{packageName}] {message}',
    installationFailed: 'Dependency installation failed in {packageName} (exit code {exitCode}).',
  },
  // Supervisor
  supervisor: {
    serviceNotRunning: 'Service "{target}" is not running.',
    serviceAlreadyRunning: 'Service "{serviceName}" is already running.',
    packageNotFound: 'Workspace package "{target}" was not found.',
    packageMissingScript: 'Package "{packageName}" does not define script "{scriptName}".',
    launchContextNotInitialized: 'Launch context is not initialized.',
    cannotStartWhileShuttingDown: 'Cannot start services while shutting down.',
    cannotRestartWhileShuttingDown: 'Cannot restart services while shutting down.',
    serviceNotRunningOrFound: 'Service "{target}" is not running or not found.',
    noRunningServicesToRestart: 'No running services to restart.',
  },
  // Discovery
  discovery: {
    packagesRequired: 'pnpm-workspace.yaml must declare a "packages" list.',
    noPackagePatterns: 'pnpm-workspace.yaml does not contain any package patterns.',
    packageMustHaveName: 'Package at {manifestPath} must have a non-empty "name".',
    invalidJson: 'Invalid JSON in {manifestPath}: {message}',
  },
  // Arguments
  arguments: {
    optionRequiresFilter: 'Option "{option}" requires a package filter.',
    optionRequiresScript: 'Option "{option}" requires a script name.',
    filterRequiresValue: 'Option "--filter" requires a package filter.',
    scriptRequiresValue: 'Option "--script" requires a script name.',
    unknownOption: 'Unknown runner option "{option}".',
    optionRequiresLocale: 'Option "{option}" requires a locale.',
    localeRequiresValue: 'Option "--locale" requires a value.',
    invalidLocale: 'Unsupported locale: "{locale}". Available: ru-RU, en-US.',
  },
  // Command Console
  commandConsole: {
    availableCommands: 'Available commands:',
    runUsage: 'Use run <package> <command> [args...] to run a command in a package.',
    startUsage: 'Use start <package>|<path> to start a stopped service.',
    stopUsage: 'Use stop [<package>|<path>] to stop a specific service or all services.',
    restartUsage: 'Use restart [<package>|<path>] to restart a service or all running services.',
    stopAll: 'Stopping workspace services...',
    stoppingService: 'Stopping service "{target}"...',
    serviceStopped: 'Service "{target}" stopped.',
    serviceStarted: 'Service "{serviceName}" started.',
    serviceRestarted: 'Service "{serviceName}" restarted.',
    allServicesRestarted: 'All running services restarted.',
    startUsageError: 'Usage: start <package>|<path>',
    startNotAvailable: 'Start is not available in this session.',
    runUsageError: 'Usage: run <package> <command> [args...]',
    packageNotFound: 'Workspace package "{packageIdentifier}" was not found.',
    commandExited: '{command} exited with code {exitCode}.',
    commandFailed: 'Command failed: {message}',
    unknownCommand: 'Unknown command: {command}',
    stopDescription: 'Stop all workspace services or a specific one: stop [<package>|<path>]',
    startDescription: 'Start a stopped service: start <package>|<path>',
    restartDescription: 'Restart a service or all running services: restart [<package>|<path>]',
    statusDescription: 'Show running service status',
    runDescription: 'Run a command in a workspace package',
    helpDescription: 'List available commands',
    servicesDescription: 'Show service status',
    installDescription: 'Run pnpm install in named packages',
    installUsage: 'Usage: install <package> [package...]',
    installing: 'Installing dependencies in {packageName}...',
  },
  // Logger
  logger: {
    // These are internal patterns, may not need translation
  },
  // CLI
  cli: {
    // Main entry point errors are handled by orchestrator
  },
  // Common/Shared
  common: {
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    success: 'Success',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
  },
  // Pluralization support for English
  // English: 1 package, 0/2+ packages
  plural: {
    package: {
      one: 'package',
      other: 'packages',
    },
    service: {
      one: 'service',
      other: 'services',
    },
  },
};
//# sourceMappingURL=en-US.js.map
