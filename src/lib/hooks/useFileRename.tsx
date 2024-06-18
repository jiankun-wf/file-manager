import { NInput, NModal } from "naive-ui";
import { nextTick, ref, unref } from "vue";
import { FileItem } from "../types";
import { commandRename } from "../command/file/rename";

export const useFileRename = () => {
  const show = ref(false);
  const name = ref<string | undefined>(void 0);
  const currentFile = ref<FileItem | undefined>(void 0);
  const submitLoading = ref(false);
  const inputRef = ref<HTMLInputElement>();

  const fileRename = (file: FileItem) => {
    name.value = file.name;
    currentFile.value = file;
    show.value = true;
    nextTick(() => {
      unref(inputRef)?.focus();
    });
  };

  const handleRename = async () => {
    try {
      submitLoading.value = true;
      await commandRename(unref(currentFile)!, unref(name)!);
      show.value = false;
    } finally {
      submitLoading.value = false;
    }
  };

  const createRef = (el: any) => {
    inputRef.value = el;
  };

  const inputChange = (val: string) => {
    name.value = val;
  };

  const renderRenameContext = (id: string) => {
    return (
      <NModal
        preset="dialog"
        title="重命名"
        show={unref(show)}
        onUpdate:show={(val) => {
          show.value = val;
        }}
        to={`#${id}`}
        onPositiveClick={handleRename}
        positiveButtonProps={{
          type: "primary",
          disabled: !unref(name) || unref(name) === unref(currentFile)?.name,
        }}
        positiveText="保存"
        negativeText="取消"
        showIcon={false}
        loading={unref(submitLoading)}
      >
        <div class="file-manager-rename__container">
          <NInput
            value={unref(name)}
            onUpdate:value={inputChange}
            placeholder="请输入新名称"
            clearable
            ref={createRef}
          />
        </div>
      </NModal>
    );
  };

  return { renderRenameContext, fileRename };
};
