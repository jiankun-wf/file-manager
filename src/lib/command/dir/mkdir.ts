import { createDir } from "@/lib/api";
import { FileStatus } from "@/lib/enum/file-status";
import { FileDirItem, FileItem } from "@/lib/types";

export const commandDirMkdir = async (
  dir: FileItem | FileDirItem,
  path: string
) => {
  const { path: npath, name: nname } = (await createDir(path)) as any;

  dir.path = npath;
  dir.name = nname;

  (dir as any).status = FileStatus.Completed;
  (dir as any).__new = void 0;
  (dir as any).__isnew = void 0;
  (dir as any).__FILE = void 0;
};
