import { describe, it, expect, beforeEach } from 'vitest';
import { t, setLocale, getLocale, loadLocale, clearLocaleCache } from '../src/i18n/index.js';
import { availableLocales, defaultLocale } from '../src/i18n/locales/index.js';

describe('i18n', () => {
  beforeEach(() => {
    clearLocaleCache();
  });

  it('should have ru-RU as default locale', () => {
    expect(defaultLocale).toBe('ru-RU');
  });

  it('should have available locales', () => {
    expect(availableLocales).toContain('ru-RU');
    expect(availableLocales).toContain('en-US');
  });

  it('should load locale and translate', async () => {
    await loadLocale('ru-RU');
    expect(t('discovery.packagesRequired')).toBe(
      'pnpm-workspace.yaml должен объявлять список "packages".',
    );
  });

  it('should translate with interpolation', async () => {
    await loadLocale('ru-RU');
    expect(t('orchestrator.noPackagesMatched', { script: 'dev' })).toContain('dev');
  });

  it('should switch locale', async () => {
    await setLocale('en-US');
    expect(getLocale()).toBe('en-US');
    expect(t('orchestrator.noPackagesMatched', { script: 'test' })).toContain('test');
  });
});

describe('arguments parsing', () => {
  it('should be importable', async () => {
    const { parseArguments } = await import('../src/runner/arguments.js');
    expect(typeof parseArguments).toBe('function');
  });
});
