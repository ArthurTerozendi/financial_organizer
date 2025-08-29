import { DateTime } from "luxon";

export function getLastTwelveMonths() {
  const months: { yearMonth: string }[] = [];

  for (let index = 11; index >= 0; index--) {
    const month = DateTime.utc()
      .minus({ months: index })
      .setLocale("pt-BR")
      .toFormat("yyyy-LL");
    months.push({ yearMonth: month });
  }

  return months;
}
