import { renameDir } from "@/lib/api";
import { FileDirItem } from "@/lib/types";

export const commandDirRename = async (dir: FileDirItem, newname: string) => {
  const { path } = (await renameDir(dir.path, newname)) as any;
  dir.path = path;
  dir.name = newname;
};
