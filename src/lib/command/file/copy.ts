import { copyFile } from "@/lib/api";
import { FileItem } from "@/lib/types";
import { Ref } from "vue";

export const commandCopy = async ({
  file,
  path,
  currentPath,
}: {
  file: FileItem[];
  path: string;
  currentPath?: Ref<string>;
}) => {
  const pts = file.map((f) => {
    return {
      dir: f.path,
      newdir: path,
    };
  });

  const res = (await copyFile(pts)) as any;

  for (const r of res) {
    const cfile = file.find((f) => f.path === r.oldpath);
    if (cfile) {
      cfile.path = r.path;
      cfile.uploadTime = r.uploadTime;
    }
  }

  if (currentPath) {
    currentPath.value = path;
  }
};
