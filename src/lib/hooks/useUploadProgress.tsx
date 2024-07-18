import { NProgress } from "naive-ui";
import { Ref, unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";

export const useUploadProgress = (file: Ref<FileManagerSpirit.FileItem>) => {
  const status = unref(file).status;
  if (status !== "uploading") return null;
  return (
    <>
      <div class="file-manager-upload-progress__mask">
        <NProgress
          type="circle"
          processing
          percentage={unref(file).progress}
          themeOverrides={{ textColorCircle: "#fff" }}
        ></NProgress>
      </div>
    </>
  );
};
