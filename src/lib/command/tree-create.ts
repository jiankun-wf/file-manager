import { DragInFileItem } from "../types/drag";
import { FileManagerSpirit } from "../types/namespace";
import { NK } from "../enum";
import { commandUpload } from "./file/upload";
import { commandDirMkdir } from "./dir/mkdir";
import { unref } from "vue";

export const fileTreeUpload = async ({
  data,
  currentPath,
  filePutIn,
  uploadPath,
  $fapi,
}: {
  data: DragInFileItem[];
  currentPath: FileManagerSpirit.currentPath;
  filePutIn: FileManagerSpirit.filePutIn;
  uploadPath?: string;
  $fapi: FileManagerSpirit.$fapi;
}) => {
  const l = data.length;

  if (!uploadPath) {
    for (let i = 0; i < l; i++) {
      const { type, file, children } = data[i];

      if (type === "file") {
        await filePutIn(
          [file as File],
          unref(currentPath),
          NK.FILE_FLAG_TYPE,
          false
        );
      } else if (type === "dir") {
        await filePutIn(
          [
            { name: file as string, type: void 0, size: 0 },
          ] as unknown as File[],
          unref(currentPath),
          NK.FILE_DIR_FLAG_TYPE,
          false
        );

        if (children?.length) {
          fileTreeUpload({
            data: children,
            currentPath: currentPath,
            filePutIn,
            uploadPath: `${unref(currentPath)}/${file as string}`,
            $fapi,
          });
        }
      }
    }
  } else {
    for (let i = 0; i < l; i++) {
      const { type, file, children } = data[i];
      // 内层的，只进行upload操作
      if (type === NK.FILE_FLAG_TYPE) {
        await commandUpload({
          file: { __FILE: file } as any,
          dir: uploadPath,
          $fapi,
        });
      } else if (type === NK.FILE_DIR_FLAG_TYPE) {
        const { npath } = await commandDirMkdir({
          dir: {} as any,
          path: uploadPath,
          $fapi,
        });

        if (children?.length) {
          fileTreeUpload({
            data: children,
            currentPath: currentPath,
            filePutIn,
            uploadPath: npath,
            $fapi,
          });
        }
      }
    }
  }
};
