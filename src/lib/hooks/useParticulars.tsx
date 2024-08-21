// 字体悬浮详情

import { Ref, unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";
import { NPopover } from "naive-ui";
import { formatSize } from "../utils/size";
import { formatDate } from "../utils/date";

export const useParticulars = ({
  currentFileRef,
}: {
  currentFileRef: Ref<FileManagerSpirit.FileItem>;
}) => {
  const render = (renderNode: JSX.Element) => {
    // 名字，类型，大小，创建时间，md5
    const { name, type, size, uploadTime, dir } = unref(currentFileRef);

    return (
      <NPopover
        trigger="hover"
        delay={1200}
        duration={200}
        overlap
        content-style={{
          fontSize: "12px",
          lineHeight: "24px",
          maxWidth: "600px",
        }}
        themeOverrides={{ padding: "6px 12px" }}
        animated={false}
      >
        {{
          trigger: () => renderNode,
          default: () => (
            <div class="file-info-tooltip">
              <div class="name" style="font-size: 16px;">
                {name}
              </div>
              <div class="type">{type}</div>
              {!dir && <div class="size">{formatSize(size)}</div>}
              <div class="uploadTime" style="color: #999;">
                {formatDate(uploadTime)}
              </div>
            </div>
          ),
        }}
      </NPopover>
    );
  };

  return {
    render,
  };
};
