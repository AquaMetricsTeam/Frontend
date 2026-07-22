export function getRelativeTime(dateString: string, locale: string = "en"): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  const divisions: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" }
  ];

  let duration = diffInSeconds;
  for (const division of divisions) {
    if (duration < division.amount) {
      const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
      return formatter.format(-Math.round(duration), division.name);
    }
    duration /= division.amount;
  }

  return date.toLocaleDateString(locale);
}
