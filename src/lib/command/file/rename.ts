import { renameFile } from "@/lib/api";
import { FileManagerSpirit } from "@/lib/types/namespace";

export const commandRename = async (file: FileManagerSpirit.FileItem, newname: string) => {
  const { path: oldPath } = file;

  const { path, url, uploadTime } = (await renameFile(oldPath, newname)) as any;

  file.name = newname;
  file.path = path;
  file.url = url;
  file.uploadTime = uploadTime;

  return file;
};
