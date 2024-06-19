import { NInput, InputInst } from "naive-ui";
import { nextTick, Ref, ref, unref } from "vue";
import { FileDirItem } from "../types";
import { commandDirRename } from "../command/dir/rename";
import { commandDirMkdir } from "../command/dir/mkdir";

export const useDirRename = (
  dir: FileDirItem,
  dirParentList: Record<string, any>[] | Ref<FileDirItem[]>,
  parent?: FileDirItem | Record<string, any>
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

    if (dir.__new) {
      if (!ndir) {
        const index = unref(dirParentList).findIndex(
          (item) => item.path === dir.path
        );
        unref(dirParentList).splice(index, 1);
        return;
      }
      const parentPath = parent ? `${parent.path}/` : "";
      await commandDirMkdir(dir, `${parentPath}${ndir}`);
      editable.value = false;
      return;
    }

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
