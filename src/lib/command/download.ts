import { unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";

export const commandDownload = async ({
  filePath,
  $fapi,
  fileName,
}: {
  filePath: string;
  $fapi: FileManagerSpirit.$fapi;
  fileName: string;
}) => {
  try {
    const urls = await unref($fapi).FILE.getUrl([filePath]);

    // const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urls[0];
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(urls[0]);
    document.body.removeChild(a);
  } finally {
  }
};
