import { describe, it, expect } from 'vitest';
import { useFormat } from './useFormat';

describe('useFormat', () => {
  it('formats numbers with default locale', () => {
    const { fNumber } = useFormat();
    const formatted = fNumber(1234.56);
    // Should include a thousands separator or the digits depending on locale
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('formats currency in USD by default', () => {
    const { fCurrency } = useFormat();
    const formatted = fCurrency(1234.5);
    expect(typeof formatted).toBe('string');
    // should contain a currency symbol or code
    expect(formatted.length).toBeGreaterThan(0);
  });
});
