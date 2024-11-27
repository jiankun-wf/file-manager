import { FileManagerSpirit } from "@/lib/types/namespace";
import { Ref, unref } from "vue";

export const commandMove = async ({
  file,
  path,
  currentPath,
  $fapi,
}: {
  file: FileManagerSpirit.FileItem[];
  path: string;
  currentPath?: Ref<string>;
  $fapi: FileManagerSpirit.$fapi;
}) => {
  const pts = file.map((f) => {
    return {
      dir: f.path,
      newdir: path,
    };
  });

  const res = await unref($fapi).FILE.move(pts);

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
