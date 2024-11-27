import { InputInst, NInput, NModal } from "naive-ui";
import { nextTick, ref, unref } from "vue";
import { commandRename } from "../command/file/rename";
import { FileManagerSpirit } from "../types/namespace";

export const useFileRename = ({
  $fapi,
}: {
  $fapi: FileManagerSpirit.$fapi;
}) => {
  const show = ref(false);
  const name = ref<string | undefined>(void 0);
  const currentFile = ref<FileManagerSpirit.FileItem | undefined>(void 0);
  const submitLoading = ref(false);
  const inputRef = ref<InputInst>();

  const fileRename = (file: FileManagerSpirit.FileItem) => {
    name.value = file.name;
    currentFile.value = file;
    show.value = true;
    nextTick(() => {
      const end = unref(name)?.lastIndexOf(".") as number;
      unref(inputRef)?.focus();
      unref(inputRef)?.inputElRef?.setSelectionRange(0, end);
    });
  };

  const handleRename = async () => {
    try {
      submitLoading.value = true;
      await commandRename({
        file: unref(currentFile)!,
        newname: unref(name)!,
        $fapi,
      });
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
