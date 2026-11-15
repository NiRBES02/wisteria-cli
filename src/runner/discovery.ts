import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { PackageManifest, WorkspacePackage } from './types.js';
import { t } from '../i18n/index.js';

const IGNORED_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.turbo',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'vendor',
]);

/**
 * Читает глобы пакетов из pnpm-workspace.yaml и возвращает папки,
 * содержащие package.json. Поддерживаются позитивные и `!` паттерны исключения.
 * @param rootDirectory - Абсолютный путь к корню монорепозитория
 * @param scriptName - Опциональное имя скрипта для фильтрации пакетов (возвращать только пакеты с этим скриптом)
 * @returns Массив пакетов рабочего пространства с name, directory и scripts
 * @throws Error если pnpm-workspace.yaml отсутствует или некорректен
 */
export async function discoverWorkspacePackages(
  rootDirectory: string,
  scriptName?: string,
): Promise<WorkspacePackage[]> {
  const workspaceFile = path.join(rootDirectory, 'pnpm-workspace.yaml');
  const workspaceConfig = await readFile(workspaceFile, 'utf8');
  const patterns = parseWorkspacePatterns(workspaceConfig);
  const positivePatterns = patterns.filter(pattern => !pattern.startsWith('!'));
  const negativePatterns = patterns
    .filter(pattern => pattern.startsWith('!'))
    .map(pattern => pattern.slice(1));
  const packageDirectories = new Set<string>();

  for (const pattern of positivePatterns) {
    const directories = await resolveWorkspacePattern(rootDirectory, pattern);
    for (const directory of directories) packageDirectories.add(directory);
  }

  const packages = await Promise.all(
    [...packageDirectories]
      .filter(directory => path.resolve(directory) !== path.resolve(rootDirectory))
      .filter(
        directory =>
          !negativePatterns.some(pattern =>
            matchesWorkspacePath(rootDirectory, directory, pattern),
          ),
      )
      .map(directory => readWorkspacePackage(rootDirectory, directory, scriptName)),
  );

  return packages.filter((package_): package_ is WorkspacePackage => package_ !== null);
}

function parseWorkspacePatterns(workspaceConfig: string): string[] {
  const packagesStart = /^\s*packages\s*:\s*(?:#.*)?$/m.exec(workspaceConfig);
  if (!packagesStart) {
    throw new Error(t('discovery.packagesRequired'));
  }

  const lines = workspaceConfig.slice(packagesStart.index + packagesStart[0].length).split(/\r?\n/);
  const patterns: string[] = [];

  for (const line of lines) {
    if (/^\S/.test(line) && line.trim() !== '') break;
    const match = /^\s*-\s*(?:"([^"]+)"|'([^']+)'|([^#\s]+))\s*(?:#.*)?$/.exec(line);
    const pattern = match?.[1] ?? match?.[2] ?? match?.[3];
    if (pattern) patterns.push(pattern.replaceAll('\\', '/').replace(/\/+$/, ''));
  }

  if (patterns.length === 0) {
    throw new Error(t('discovery.noPackagePatterns'));
  }

  return patterns;
}

async function resolveWorkspacePattern(rootDirectory: string, pattern: string): Promise<string[]> {
  const segments = pattern.split('/').filter(Boolean);
  return resolvePatternSegments(rootDirectory, rootDirectory, segments, 0);
}

async function resolvePatternSegments(
  rootDirectory: string,
  currentDirectory: string,
  segments: string[],
  index: number,
): Promise<string[]> {
  if (index === segments.length) return [currentDirectory];

  const segment = segments[index];
  if (!segment) return [];

  if (segment === '**') {
    const matches = await resolvePatternSegments(
      rootDirectory,
      currentDirectory,
      segments,
      index + 1,
    );
    const children = await readDirectories(currentDirectory);
    const descendants = await Promise.all(
      children.map(child => resolvePatternSegments(rootDirectory, child, segments, index)),
    );
    return [...matches, ...descendants.flat()];
  }

  if (segment.includes('*')) {
    const matcher = new RegExp(`^${escapeRegExp(segment).replaceAll('\\*', '.*')}$`);
    const children = await readDirectories(currentDirectory);
    const matches = children.filter(child => matcher.test(path.basename(child)));
    const results = await Promise.all(
      matches.map(child => resolvePatternSegments(rootDirectory, child, segments, index + 1)),
    );
    return results.flat();
  }

  const nextDirectory = path.join(currentDirectory, segment);
  if (!isWithinWorkspace(rootDirectory, nextDirectory)) return [];

  try {
    await readdir(nextDirectory, { withFileTypes: true });
    return resolvePatternSegments(rootDirectory, nextDirectory, segments, index + 1);
  } catch (error) {
    if (isMissingPathError(error)) return [];
    throw error;
  }
}

async function readDirectories(directory: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (isMissingPathError(error)) return [];
    throw error;
  }

  return entries
    .filter(entry => entry.isDirectory() && !IGNORED_DIRECTORIES.has(entry.name))
    .map(entry => path.join(directory, entry.name));
}

async function readWorkspacePackage(
  rootDirectory: string,
  directory: string,
  scriptName?: string,
): Promise<WorkspacePackage | null> {
  const manifestPath = path.join(directory, 'package.json');
  let manifest: PackageManifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as PackageManifest;
  } catch (error) {
    if (isMissingPathError(error)) return null;
    if (error instanceof SyntaxError) {
      throw new Error(t('discovery.invalidJson', { manifestPath, message: error.message }), {
        cause: error,
      });
    }
    throw error;
  }

  if (!manifest.name) {
    throw new Error(t('discovery.packageMustHaveName', { manifestPath }));
  }

  const scripts = Object.fromEntries(
    Object.entries(manifest.scripts ?? {}).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  );
  if (scriptName && !scripts[scriptName]) return null;

  return {
    name: manifest.name,
    directory,
    relativeDirectory: path.relative(rootDirectory, directory).replaceAll('\\', '/'),
    scripts,
  };
}

function matchesWorkspacePath(rootDirectory: string, directory: string, pattern: string): boolean {
  const relativeDirectory = path.relative(rootDirectory, directory).replaceAll('\\', '/');
  const matcher = new RegExp(
    `^${escapeRegExp(pattern).replaceAll('\\*\\*', '.*').replaceAll('\\*', '[^/]*')}$`,
  );
  return matcher.test(relativeDirectory);
}

function isWithinWorkspace(rootDirectory: string, directory: string): boolean {
  const relativePath = path.relative(rootDirectory, directory);
  return (
    relativePath === '' ||
    (relativePath !== '..' &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
}

function isMissingPathError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
