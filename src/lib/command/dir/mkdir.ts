import { createDir } from "@/lib/api";
import { FileDirItem } from "@/lib/types";

export const commandDirMkdir = async (dir: FileDirItem, path: string) => {
  const { path: npath, name: nname } = (await createDir(path)) as any;

  dir.path = npath;
  dir.name = nname;

  dir.__new = void 0;
};
