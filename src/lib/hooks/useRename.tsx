import { NInput, InputInst, NEllipsis } from "naive-ui";
import { nextTick, Ref, ref, unref } from "vue";
import { commandDirRename } from "../command/dir/rename";
import { commandDirMkdir } from "../command/dir/mkdir";
import { makeFileName } from "../utils/extension";
import { NK } from "../enum";
import { commandRename } from "../command/file/rename";
import { eventStop } from "../utils/event";
import { FileManagerSpirit } from "../types/namespace";

export const useDirRename = (
  dir: FileManagerSpirit.FileDirItem,
  dirParentList: Record<string, any>[] | Ref<FileManagerSpirit.FileDirItem[]>,
  parent?: FileManagerSpirit.FileDirItem | Record<string, any>
) => {
  const editable = ref(false);
  const inputValue = ref("");

  const inputRef = ref<InputInst>();

  const handleRename = () => {
    inputValue.value = dir.name;
    editable.value = true;
    nextTick(() => {
      unref(inputRef)?.focus();
      unref(inputRef)?.select();
    });
  };

  const handleInput = (val: string) => {
    inputValue.value = val;
  };

  const handleBlur = async () => {
    const ndir = unref(inputValue);
    if (!ndir?.trim()) {
      editable.value = false;
      if (dir.__new) {
        const index = unref(dirParentList).findIndex(
          (item) => item.path === dir.path
        );
        unref(dirParentList).splice(index, 1);
      }
      return;
    }

    // 如果为新建文件夹，则直接移除
    if (dir.__new) {
      const parentPath = parent ? `${parent.path}/` : "";
      await commandDirMkdir(dir, `${parentPath}${ndir}`);
      editable.value = false;
      return;
    }
    // 与原名相同则不做任何操作
    if (ndir === dir.name) {
      editable.value = false;
      return;
    }

    await commandDirRename(dir, ndir);

    editable.value = false;
  };

  const renderDirRenameInput = (defaultName: string) => {
    if (!unref(editable)) {
      return defaultName;
    }
    return (
      <NInput
        size="small"
        placeholder=""
        value={unref(inputValue)}
        onUpdate:value={handleInput}
        onBlur={handleBlur}
        ref={(ref) => {
          inputRef.value = ref as any;
        }}
      />
    );
  };

  return { renderDirRenameInput, handleRename, naming: editable };
};

export const useFileRename = ({
  currentFile,
  fileList,
}: {
  currentFile: Readonly<Ref<FileManagerSpirit.FileItem>>;
  fileList: FileManagerSpirit.fileList;
}) => {
  const editable = ref(false);
  const inputValue = ref("");

  const inputRef = ref<InputInst>();

  const handleRename = () => {
    inputValue.value = unref(currentFile).name;
    editable.value = true;
    nextTick(() => {
      unref(inputRef)?.focus();
      if (unref(currentFile).dir) {
        unref(inputRef)?.textareaElRef?.select();
      } else {
        const end = unref(currentFile).name.lastIndexOf(".") as number;
        unref(inputRef)?.textareaElRef?.setSelectionRange(0, end);
      }
    });
  };

  const handleInput = (val: string) => {
    inputValue.value = val;
  };

  const handleBlur = async () => {
    const nname = unref(inputValue).trim();

    const { __isnew, dir } = unref(currentFile);

    if (dir) {
      if (!nname) {
        editable.value = false;
        if (__isnew) {
          const index = fileList.value.findIndex(
            (item) => item.path === unref(currentFile).path
          );
          fileList.value.splice(index, 1);
        }
        return;
      }
      if (nname === unref(currentFile).name && !__isnew) {
        editable.value = false;
        return;
      }

      const newFileName = makeFileName(
        nname,
        unref(fileList),
        NK.FILE_DIR_FLAG_TYPE
      );
      if (__isnew) {
        await commandDirMkdir(unref(currentFile), unref(currentFile).path);
      } else {
        await commandDirRename(unref(currentFile), newFileName);
      }
      editable.value = false;
    } else {
      // 文件重命名
      if (!nname || nname === unref(currentFile).name) {
        editable.value = false;
        return;
      }

      const newFileName = makeFileName(
        nname,
        unref(fileList),
        NK.FILE_FLAG_TYPE
      );
      await commandRename(unref(currentFile), newFileName);
      editable.value = false;
    }
  };

  const renderFileRenameContext = () => {
    return (
      <div
        class="file-manager__file-item__name"
        title={unref(currentFile).name}
        onDblclick={(event: MouseEvent) => {
          eventStop(event);
          handleRename.call(null);
        }}
      >
        {unref(editable) ? (
          <NInput
            size="tiny"
            type="textarea"
            autosize={{ minRows: 1, maxRows: 5 }}
            placeholder=""
            value={unref(inputValue)}
            onUpdate:value={handleInput}
            onBlur={handleBlur}
            ref={(ref) => {
              inputRef.value = ref as any;
            }}
          />
        ) : (
          <NEllipsis line-clamp={3} tooltip={false}>
            {unref(currentFile).name}
          </NEllipsis>
        )}
      </div>
    );
  };

  return {
    renderFileRenameContext,
    handleRename,
  };
};
