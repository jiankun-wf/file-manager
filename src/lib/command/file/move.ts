import { moveFile } from "@/lib/api";
import { FileManagerSpirit } from "@/lib/types/namespace";
import { Ref } from "vue";

export const commandMove = async ({
  file,
  path,
  currentPath,
}: {
  file: FileManagerSpirit.FileItem[];
  path: string;
  currentPath?: Ref<string>;
}) => {
  const pts = file.map((f) => {
    return {
      dir: f.path,
      newdir: path,
    };
  });

  const res = (await moveFile(pts)) as any;

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
