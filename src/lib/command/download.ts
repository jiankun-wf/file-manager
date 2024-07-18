import { downloadFile } from "../api";

export const commandDownload = async (filePath: string) => {
  try {
    const { blob, name }: { blob: Blob; name: string } = (await downloadFile(
      filePath
    )) as any;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  } finally {
  }
};
