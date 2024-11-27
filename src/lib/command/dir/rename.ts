import { FileManagerSpirit } from "@/lib/types/namespace";
import { unref } from "vue";

export const commandDirRename = async ({
  dir,
  newname,
  $fapi,
}: {
  dir: FileManagerSpirit.FileDirItem;
  newname: string;
  $fapi: FileManagerSpirit.$fapi;
}) => {
  const { path } = await unref($fapi).DIR.rename(dir.path, newname);
  dir.path = path;
  dir.name = newname;
};
