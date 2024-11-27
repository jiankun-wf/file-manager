import { FileManagerSpirit } from "@/lib/types/namespace";
import { unref } from "vue";

export const commandRename = async ({
  file,
  newname,
  $fapi,
}: {
  file: FileManagerSpirit.FileItem;
  newname: string;
  $fapi: FileManagerSpirit.$fapi;
}) => {
  const { path: oldPath } = file;

  const { path, url, uploadTime } = await unref($fapi).FILE.rename(
    oldPath,
    newname
  );

  file.name = newname;
  file.path = path;
  file.url = url;
  file.uploadTime = uploadTime;

  return file;
};
