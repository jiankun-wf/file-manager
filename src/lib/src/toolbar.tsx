import { defineComponent, renderSlot, unref } from "vue";
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteFilled,
  DragOutlined,
} from "@vicons/antd";

import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { useContext } from "../utils/context";
import { commandDelete } from "../command/file/delete";
import { NK } from "../enum";
import { FileAction } from "../enum/file-action";
export const Toolbar = defineComponent({
  name: "Toolbar",
  setup(_, { slots }) {
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
      filePutIn(files, unref(currentPath), NK.FILE_FLAG_TYPE);
    };

    const handleCopy = () => {
      openFileChangeModal({
        file: unref(selectedFiles),
        action: FileAction.COPY,
        currentDirPath: unref(currentPath),
      });
    };

    const handleMove = () => {
      openFileChangeModal({
        file: unref(selectedFiles),
        action: FileAction.MOVE,
        currentDirPath: unref(currentPath),
      });
    };

    return () => (
      <div class="file-manager__toolbar">
        {slots.prefix && renderSlot(slots, "prefix")}
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

        {false ? (
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
