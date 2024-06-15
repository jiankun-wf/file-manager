const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export function formatSize(size: number, sizeUnit: number = 0): string {
  const nsize = size / 1024;

  if (nsize < 1) {
    return `${nsize.toFixed(2)}${units[sizeUnit]}`;
  }

  return formatSize(nsize, sizeUnit + 1);
}