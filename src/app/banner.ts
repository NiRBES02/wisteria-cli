import chalk from 'chalk';
import type { RunnerLogger } from '../cli/logger.js';
import type { PackageManifest } from '../runner/types.js';
import { t } from '../i18n/index.js';

/**
 * Выводит баннер Wisteria CLI с информацией о проекте и версией.
 * @param logger - Логгер раннера для вывода
 * @param manifest - Манифест корневого пакета для отображения версии
 */
export function printBanner(logger: RunnerLogger, manifest: PackageManifest): void {
  const title = `💜 ${chalk.magenta.bold('WISTERIA')} 💜`;
  // eslint-disable-next-line no-control-regex
  const visibleTitle = title.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, '');
  const padding = 8;
  const rule = `╔${'═'.repeat(visibleTitle.length + padding * 2)}╗`;

  logger.log(` ${chalk.gray(rule)}`);
  logger.log(
    ` ${chalk.gray('║')}${' '.repeat(padding)}${title}${' '.repeat(padding)}${chalk.gray('║')}`,
  );
  logger.log(` ${chalk.gray(`╚${'═'.repeat(visibleTitle.length + padding * 2)}╝`)}`);
  logger.log(`    ${chalk.bold(t('banner.project'))}  ::  ${chalk.blue('https://wisteriamc.ru')}`);
  if (manifest.version)
    logger.log(
      `    ${chalk.bold(t('banner.version'))}  ::  ${chalk.magenta(`v${manifest.version}`)}`,
    );
}
