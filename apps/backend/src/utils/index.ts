import { DateTime } from "luxon";

export function parseDate(value: string | null): Date | null {
  if (!value) return null;

  const formats = [
    "yyyyMMddHHmmss",
    "yyyyMMddHHmm",
    "yyyyMMdd",
    "yyyy-mm-dd",
    "yyyy/mm/dd",
  ];

  for (const format of formats) {
    const date = DateTime.fromFormat(value, format);
    if (date.isValid) {
      return date.toUTC().toJSDate();
    }
  }

  const isoDate = DateTime.fromISO(value);
  if (isoDate.isValid) {
    return isoDate.toUTC().toJSDate();
  }

  console.warn(`Could not parse date: ${value}`);
  return null;
}
