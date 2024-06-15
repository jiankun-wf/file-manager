import { defineComponent, unref } from "vue";
import {
  CloudUploadOutlined,
  CopyOutlined,
  DeleteFilled,
  DownloadOutlined,
  DragOutlined,
} from "@vicons/antd";

import "../style/toobar.less";
import { NButton, NIcon } from "naive-ui";
import { useContext } from "../utils/context";
export const Toolbar = defineComponent({
  name: "Toolbar",
  setup() {
    const { selectedFiles } = useContext();

    return () => (
      <div class="file-manager__toolbar">
        <NButton>
          {{
            icon: (
              <NIcon>
                <CloudUploadOutlined />
              </NIcon>
            ),
            default: () => "上传",
          }}
        </NButton>

        {unref(selectedFiles).length ? (
          <>
            <NButton>
              {{
                icon: (
                  <NIcon>
                    <DownloadOutlined />
                  </NIcon>
                ),
                default: () => "下载",
              }}
            </NButton>

            <NButton>
              {{
                icon: (
                  <NIcon>
                    <DragOutlined />
                  </NIcon>
                ),
                default: () => "移动",
              }}
            </NButton>

            <NButton>
              {{
                icon: (
                  <NIcon>
                    <CopyOutlined />
                  </NIcon>
                ),
                default: () => "复制",
              }}
            </NButton>

            <NButton type="error">
              {{
                icon: (
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
