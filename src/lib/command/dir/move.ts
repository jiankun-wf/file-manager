import { FileManagerSpirit } from "@/lib/types/namespace";
import { Ref, unref } from "vue";

export const commandDirMove = async ({
  targetDirPath,
  fromDirPath,
  currentPath,
  dirList,
  $fapi,
}: {
  targetDirPath: string;
  fromDirPath: string;
  currentPath: Ref<string>;
  dirList: Ref<FileManagerSpirit.FileDirItem[]>;
  $fapi: FileManagerSpirit.$fapi;
}) => {
  const { path } = await unref($fapi).DIR.move([
    { dir: fromDirPath, newdir: targetDirPath },
  ]);

  const ds = await unref($fapi).PROVIDER.list();
  dirList.value = ds;

  currentPath.value = path;
};
