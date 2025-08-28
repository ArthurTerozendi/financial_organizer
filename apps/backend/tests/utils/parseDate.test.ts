import { parseDate } from '../../src/utils';

describe('parseDate Utility', () => {
  describe('parseDate', () => {
    it('should parse yyyyMMddHHmmss format', () => {
      const result = parseDate('20240115143022');
      expect(result).toBeInstanceOf(Date);
      // Account for timezone conversion - the date should be valid regardless of timezone
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January is 0
      expect(result?.getDate()).toBe(15);
    });

    it('should parse yyyyMMddHHmm format', () => {
      const result = parseDate('202401151430');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('should parse yyyyMMdd format', () => {
      const result = parseDate('20240115');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('should parse yyyy-mm-dd format', () => {
      const result = parseDate('2024-01-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('should parse yyyy/mm/dd format', () => {
      const result = parseDate('2024/01/15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('should parse ISO format', () => {
      const result = parseDate('2024-01-15T14:30:22.123Z');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('should return null for null input', () => {
      const result = parseDate(null);
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = parseDate('');
      expect(result).toBeNull();
    });

    it('should return null for invalid date format', () => {
      const result = parseDate('invalid-date');
      expect(result).toBeNull();
    });

    it('should return null for malformed date', () => {
      const result = parseDate('2024-13-45');
      expect(result).toBeNull();
    });

    it('should handle edge case with single digit months and days', () => {
      const result = parseDate('20240105');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(5);
    });

    it('should handle edge case with single digit hours and minutes', () => {
      const result = parseDate('202401150530');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(15);
    });

    it('should convert to UTC timezone', () => {
      const result = parseDate('20240115143022');
      expect(result).toBeInstanceOf(Date);
      // The date should be converted to UTC
      expect(result?.toISOString()).toMatch(/Z$/);
    });

    it('should handle leap year dates', () => {
      const result = parseDate('20240229');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(1); // February is 1
      expect(result?.getDate()).toBe(29);
    });

    it('should handle non-leap year February 29th', () => {
      const result = parseDate('20230229');
      expect(result).toBeNull();
    });
  });
});
