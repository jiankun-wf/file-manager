import dayjs from "dayjs";

export function formatDate(
  date: dayjs.ConfigType,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string {
  return dayjs(date).format(format);
}
