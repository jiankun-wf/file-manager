import { defineComponent, unref } from "vue";
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteFilled,
  DownloadOutlined,
  DragOutlined,
} from "@vicons/antd";

import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { useContext } from "../utils/context";
import { commandDelete } from "../command/file/delete";
export const Toolbar = defineComponent({
  name: "Toolbar",
  setup() {
    const {
      selectedFiles,
      fileList,
      chooseFile,
      currentPath,
      filePutIn,
      openFileChangeModal,
    } = useContext();

    const dialog = useDialog();
    const message = useMessage();

    const handleDeleteFiles = async () => {
      const flag = await commandDelete({
        files: unref(selectedFiles),
        fileList,
        selectedFiles,
        dialog,
      });

      flag && message.success("删除成功");
    };

    const handleUploadFiles = async () => {
      const files = await chooseFile();
      if (!files) return;
      filePutIn(files, unref(currentPath));
    };

    const handleCopy = () => {
      openFileChangeModal({
        file: unref(selectedFiles),
        action: "copy",
        currentDirPath: unref(currentPath),
      });
    };

    const handleMove = () => {
      openFileChangeModal({
        file: unref(selectedFiles),
        action: "move",
        currentDirPath: unref(currentPath),
      });
    };

    return () => (
      <div class="file-manager__toolbar">
        <NButton onClick={handleUploadFiles}>
          {{
            icon: () => (
              <NIcon>
                <CloudUploadOutlined />
              </NIcon>
            ),
            default: () => "上传",
          }}
        </NButton>

        {unref(selectedFiles).length ? (
          <>
            {/* <NButton>
              {{
                icon: () => (
                  <NIcon>
                    <DownloadOutlined />
                  </NIcon>
                ),
                default: () => "下载",
              }}
            </NButton> */}

            <NButton onClick={handleMove}>
              {{
                icon: () => (
                  <NIcon>
                    <DragOutlined />
                  </NIcon>
                ),
                default: () => "移动",
              }}
            </NButton>

            <NButton onClick={handleCopy}>
              {{
                icon: () => (
                  <NIcon>
                    <CopyOutlined />
                  </NIcon>
                ),
                default: () => "复制",
              }}
            </NButton>

            <NButton type="error" onClick={handleDeleteFiles}>
              {{
                icon: () => (
                  <NIcon color="#fff">
                    <DeleteFilled />
                  </NIcon>
                ),
                default: () => "删除",
              }}
            </NButton>
          </>
        ) : (
          ""
        )}
      </div>
    );
  },
});
