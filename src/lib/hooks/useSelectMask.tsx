import { ComputedRef, ref, unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";
import { NButton } from "naive-ui";
import { eventStop } from "../utils/event";
import { ApiInterface } from "../enum/interface";

export const useFileSelectMask = ({
  selectedFiles,
  isOnlyRead,
  $http,
  emit,
}: {
  selectedFiles: FileManagerSpirit.selectedFiles;
  isOnlyRead: ComputedRef<boolean>;
  $http: FileManagerSpirit.AxiosRequest;
  emit: FileManagerSpirit.Emit;
}) => {
  const selectLoading = ref(false);

  const handleConfirm = async (e: MouseEvent) => {
    eventStop(e);
    try {
      selectLoading.value = true;

      const urls: string[] = await $http.$request({
        url: ApiInterface.FILE_URL,
        params: {
          path: unref(selectedFiles)
            .map((f) => f.path)
            .join(","),
        },
      });
      emit(
        "file-select",
        unref(selectedFiles).map((f) => ({
          ...f,
          url: urls.shift(),
        }))
      );
      debugger;
    } finally {
      selectLoading.value = false;
    }
  };

  const handleClearFiles = (e: MouseEvent) => {
    eventStop(e);
    selectedFiles.value = [];
  };

  const render = () => {
    if (!unref(isOnlyRead)) return null;
    if (!unref(selectedFiles).length) return null;
    return (
      <div class="file-manager-select-confirm_mask">
        <NButton size="small" onClick={handleClearFiles}>
          清空
        </NButton>
        <NButton
          loading={unref(selectLoading)}
          size="small"
          type="primary"
          onClick={handleConfirm}
        >
          确认
        </NButton>
      </div>
    );
  };

  return {
    handleConfirm,
    render,
  };
};
