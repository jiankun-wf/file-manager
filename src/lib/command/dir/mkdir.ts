import { FileStatus } from "@/lib/enum/file-status";
import { FileManagerSpirit } from "@/lib/types/namespace";
import { unref } from "vue";

export const commandDirMkdir = async ({
  dir,
  path,
  $fapi,
}: {
  dir: FileManagerSpirit.FileItem | FileManagerSpirit.FileDirItem;
  path: string;
  $fapi: FileManagerSpirit.$fapi;
}) => {
  await unref($fapi).DIR.create(path);

  dir.path = path;
  dir.name = path.split("/").pop()!;

  (dir as any).status = FileStatus.Completed;
  (dir as any).__new = void 0;
  (dir as any).__isnew = void 0;
  (dir as any).__FILE = void 0;

  return { npath: path, nname: dir.name };
};
