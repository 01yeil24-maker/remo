const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** 2026. 10. 01. */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** 2026. 10. 01. 14:30 */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}
