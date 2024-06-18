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
  currentPath: Ref<string>;
}) => {
  const pts = file.map((f) => {
    return {
      dir: f.path,
      newdir: path,
    };
  });

  await copyFile(pts);

  currentPath.value = path;
};
