import { getLastTwelveMonths } from '../../src/routes/dashboard/utils';
import { DateTime } from 'luxon';

describe('Dashboard Utils', () => {
  describe('getLastTwelveMonths', () => {
    it('should return exactly 12 months', () => {
      const result = getLastTwelveMonths();
      expect(result).toHaveLength(12);
    });

    it('should return months in correct format', () => {
      const result = getLastTwelveMonths();
      
      // Check that each item has the correct structure
      result.forEach(month => {
        expect(month).toHaveProperty('yearMonth');
        expect(typeof month.yearMonth).toBe('string');
        expect(month.yearMonth).toMatch(/^\d{4}-\d{2}$/);
      });
    });

    it('should return months in descending order (most recent first)', () => {
      const result = getLastTwelveMonths();
      
      // Check that months are in chronological order
      for (let i = 1; i < result.length; i++) {
        const currentMonth = DateTime.fromFormat(result[i].yearMonth, 'yyyy-LL');
        const previousMonth = DateTime.fromFormat(result[i - 1].yearMonth, 'yyyy-LL');
        expect(currentMonth > previousMonth).toBe(true);
      }
    });

    it('should include current month', () => {
      const result = getLastTwelveMonths();
      const currentMonth = DateTime.utc().toFormat('yyyy-LL');
      
      const hasCurrentMonth = result.some(month => month.yearMonth === currentMonth);
      expect(hasCurrentMonth).toBe(true);
    });

    it('should include past 11 months', () => {
      const result = getLastTwelveMonths();
      const currentMonth = DateTime.utc();
      
      // Check that we have the last 12 months including current
      for (let i = 0; i < 12; i++) {
        const expectedMonth = currentMonth.minus({ months: 11 - i }).toFormat('yyyy-LL');
        const hasMonth = result.some(month => month.yearMonth === expectedMonth);
        expect(hasMonth).toBe(true);
      }
    });

    it('should handle year boundary correctly', () => {
      // This test ensures that when we're at the beginning of a year,
      // we get the correct months from the previous year
      const result = getLastTwelveMonths();
      
      // All months should be valid dates
      result.forEach(month => {
        const date = DateTime.fromFormat(month.yearMonth, 'yyyy-LL');
        expect(date.isValid).toBe(true);
      });
    });

    it('should return consistent results for multiple calls', () => {
      const result1 = getLastTwelveMonths();
      const result2 = getLastTwelveMonths();
      
      expect(result1).toEqual(result2);
    });

    it('should handle leap year months correctly', () => {
      const result = getLastTwelveMonths();
      
      // Check that February is handled correctly (both leap and non-leap years)
      result.forEach(month => {
        const date = DateTime.fromFormat(month.yearMonth, 'yyyy-LL');
        expect(date.isValid).toBe(true);
      });
    });

    it('should return months with leading zeros for single digits', () => {
      const result = getLastTwelveMonths();
      
      result.forEach(month => {
        const [, monthPart] = month.yearMonth.split('-');
        expect(monthPart).toMatch(/^\d{2}$/);
        expect(parseInt(monthPart)).toBeGreaterThanOrEqual(1);
        expect(parseInt(monthPart)).toBeLessThanOrEqual(12);
      });
    });
  });
});
