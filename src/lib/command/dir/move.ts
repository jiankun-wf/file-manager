import { getDirsList, moveDir } from "@/lib/api";
import { FileDirItem } from "@/lib/types";
import { Ref } from "vue";

export const commandDirMove = async ({
  targetDirPath,
  fromDirPath,
  currentPath,
  dirList,
}: {
  targetDirPath: string;
  fromDirPath: string;
  currentPath: Ref<string>;
  dirList: Ref<FileDirItem[]>;
}) => {
  const { path } = (await moveDir({
    dir: fromDirPath,
    newdir: targetDirPath,
  })) as any;

  const ds = (await getDirsList()) as any;
  dirList.value = ds;

  currentPath.value = path;

  //   moveTreeNode(unref(dirList), fromDirPath, targetDirPath, path);

  //   removeTreeNode(unref(dirList), (node: FileDirItem) => {
  //     return node.path === fromDirPath;
  //   });
};
