import { NK } from "../enum";
import type { DragInFileItem } from "../types/drag";

export const setDragTransfer = (
  event: DragEvent,
  type: string = NK.INNER_DRAG_FILE,
  path: string
) => {
  if (!event.dataTransfer) return;
  event.dataTransfer.setData(
    NK.DRAG_DATA_TRANSFER_TYPE,
    JSON.stringify({
      [NK.INNER_DRAG_FLAG]: true,
      [NK.INNER_DRAG_PATH]: path,
      [NK.INNER_DRAG_TYPE]: type,
    })
  );
};

export const setDragStyle = (
  event: DragEvent,
  type: string = NK.INNER_DRAG_FILE,
  path: string
) => {
  const classSector =
    type === NK.INNER_DRAG_FILE
      ? "file-manager-drag-mask"
      : "folder-manager-drag-mask";
  let dragMaskEl = document.querySelector(`div.${classSector}`);
  if (!dragMaskEl) {
    const div = document.createElement("div");
    div.classList.add(classSector);
    div.style.position = "fixed";
    div.style.top = "-999px";
    dragMaskEl = div;
    document.body.appendChild(dragMaskEl);
  }

  dragMaskEl.innerHTML = "";

  if (type === NK.INNER_DRAG_FILE) {
    const ps = path.split(NK.ARRAY_JOIN_SEPARATOR);

    dragMaskEl.setAttribute("data-move-number", `移动${ps.length}个文件`);

    const elements = ps.map((p) =>
      document.querySelector(`div[data-path-name="${p}"] img`)
    );

    dragMaskEl.innerHTML = elements.map((e) => e?.outerHTML).join("");
    event.dataTransfer?.setDragImage(dragMaskEl, 10, 10);
  } else {
    dragMaskEl.setAttribute("data-move-number", `${path}`);
    dragMaskEl.innerHTML = `<svg class="icon file-manager-dir__tree-item-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10594" width="48" height="48"><path d="M918.673 883H104.327C82.578 883 65 867.368 65 848.027V276.973C65 257.632 82.578 242 104.327 242h814.346C940.422 242 958 257.632 958 276.973v571.054C958 867.28 940.323 883 918.673 883z" fill="#FFE9B4" p-id="10595"></path><path d="M512 411H65V210.37C65 188.597 82.598 171 104.371 171h305.92c17.4 0 32.71 11.334 37.681 28.036L512 411z" fill="#FFB02C" p-id="10596"></path><path d="M918.673 883H104.327C82.578 883 65 865.42 65 843.668V335.332C65 313.58 82.578 296 104.327 296h814.346C940.422 296 958 313.58 958 335.332v508.336C958 865.32 940.323 883 918.673 883z" fill="#FFCA28" p-id="10597"></path></svg>`;
    event.dataTransfer?.setDragImage(dragMaskEl, 10, 10);
  }
};

export const getDirsContent = (dir: FileSystemDirectoryEntry) => {
  return new Promise<DragInFileItem[]>((resolve) => {
    const reader = dir.createReader();
    const fileAndDirs: DragInFileItem[] = [];

    let count = 0;
    reader.readEntries(
      async (entries) => {
        // entries是包含文件夹内容的数组
        for (let j = 0; j < entries.length; j++) {
          const fileEntry = entries[j] as FileSystemFileEntry;
          if (fileEntry.isFile) {
            // 文件
            fileEntry.file(function (file) {
              fileAndDirs.push({
                type: "file",
                file,
              } as DragInFileItem<"file">);
              count++;
              if (count === entries.length) {
                resolve(fileAndDirs);
              }
            });
          } else if (fileEntry.isDirectory) {
            // 文件夹
            const dirEntry = fileEntry as unknown as FileSystemDirectoryEntry;
            const ojb: DragInFileItem<"dir"> = {
              type: "dir",
              children: [],
              file: fileEntry.name,
            };

            ojb.children = await getDirsContent(dirEntry);
            fileAndDirs.push(ojb);
            count++;
            if (count === entries.length) {
              resolve(fileAndDirs);
            }
          }
        }
      },
      function (error) {
        console.error("读取文件夹出错:", dir.fullPath, error);
        resolve(fileAndDirs);
      }
    );
  });
};

export const splitDragFiles = async (
  items: DataTransferItem[]
): Promise<DragInFileItem[]> => {
  const files = await Promise.all(
    items.map(async (item) => {
      if (!item) return;
      const entry = item.webkitGetAsEntry();

      if (!entry) return;

      if (entry.isDirectory) {
        const children = await getDirsContent(
          entry as FileSystemDirectoryEntry
        );
        return {
          type: "dir",
          children,
          file: entry.name,
        } as DragInFileItem<"dir">;
      } else {
        return {
          type: "file",
          file: item.getAsFile()!,
        } as DragInFileItem<"file">;
      }
    })
  );
  return files.filter((f) => !!f);
};
