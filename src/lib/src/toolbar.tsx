import { defineComponent, renderSlot, unref } from "vue";
import { CloudUploadOutlined } from "@vicons/antd";

import { NButton, NIcon } from "naive-ui";
import { useActionContext, useContext } from "../utils/context";
import { NK } from "../enum";

export const Toolbar = defineComponent({
  name: "Toolbar",
  setup(_, { slots }) {
    const { currentPath, isOnlyRead } = useContext();
    const { chooseFile, filePutIn } = useActionContext();

    const handleUploadFiles = async () => {
      const files = await chooseFile();
      if (!files) return;
      filePutIn(files, unref(currentPath), NK.FILE_FLAG_TYPE);
    };
    return () => (
      <div class="file-manager__toolbar">
        {slots.prefix && renderSlot(slots, "prefix")}
        {!unref(isOnlyRead) && (
          <NButton onClick={handleUploadFiles} type="default">
            {{
              icon: () => (
                <NIcon>
                  <CloudUploadOutlined />
                </NIcon>
              ),
              default: () => "上传",
            }}
          </NButton>
        )}
      </div>
    );
  },
});
