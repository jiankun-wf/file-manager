import { renameDir } from "@/lib/api";
import { FileManagerSpirit } from "@/lib/types/namespace";

export const commandDirRename = async (
  dir: FileManagerSpirit.FileDirItem,
  newname: string
) => {
  const { path } = (await renameDir(dir.path, newname)) as any;
  dir.path = path;
  dir.name = newname;
};
