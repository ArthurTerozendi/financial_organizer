import { DateTime } from 'luxon';

export function parseDate(value: string | null): Date | null {
  if (!value) return null;

  let date = DateTime.fromFormat(value, 'yyyy-mm-dd');

  if (date.isValid) return date.toUTC().toJSDate();
  
  return null;
}