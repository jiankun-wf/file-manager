import { moveFile } from "@/lib/api";
import { FileItem } from "@/lib/types";
import { Ref } from "vue";

export const commandMove = async ({
  file,
  path,
  currentPath,
}: {
  file: FileItem[];
  path: string;
  currentPath: Ref<string>;
}) => {
  const pts = file.map((f) => {
    return {
      dir: f.path,
      newdir: path,
    };
  });

  await moveFile(pts);

  currentPath.value = path;
};
