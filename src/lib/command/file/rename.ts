import { renameFile } from "@/lib/api";
import { FileItem } from "@/lib/types";

export const commandRename = async (file: FileItem, newname: string) => {
  const { path: oldPath } = file;

  const { path, url, uploadTime } = (await renameFile(oldPath, newname)) as any;

  file.name = newname;
  file.mockname = newname;
  file.path = path;
  file.url = url;
  file.uploadTime = uploadTime;

  return file;
};
