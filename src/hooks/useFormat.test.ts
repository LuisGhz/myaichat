import { describe, it, expect } from 'vitest';
import { useFormat } from './useFormat';

describe('useFormat', () => {
  const { fNumber, fCurrency } = useFormat();

  describe('fNumber', () => {
    it('formats numbers with default options', () => {
      expect(fNumber(1234.56)).toBe(Intl.NumberFormat(undefined).format(1234.56));
    });
    it('formats numbers with custom fraction digits', () => {
      expect(fNumber(1234.567, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe(
        Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(1234.567)
      );
    });
  });

  describe('fCurrency', () => {
    it('formats currency with default USD', () => {
      expect(fCurrency(1234.56)).toBe(
        Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(1234.56)
      );
    });
    it('formats currency with custom fraction digits', () => {
      expect(fCurrency(1234.567, { minimumFractionDigits: 1, maximumFractionDigits: 1 })).toBe(
        Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(1234.567)
      );
    });
  });
});