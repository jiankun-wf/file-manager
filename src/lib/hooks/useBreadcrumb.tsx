import { computed, nextTick, ref, unref } from "vue";
import {
  RightOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
} from "@vicons/antd";
import { InputInst, NIcon, NInput } from "naive-ui";
import { FileManagerSpirit } from "../types/namespace";
import { eventStopPropagation } from "../utils/event";

export const useBreadcrumb = ({
  currentPath,
  loadDirContent,
  paginationRef,
}: {
  currentPath: FileManagerSpirit.currentPath;
  loadDirContent: FileManagerSpirit.loadDirContent;
  paginationRef: FileManagerSpirit.PaginationRef;
}) => {
  const pathBackHistory = ref<string[]>([]);
  const pathForwardHistory = ref<string[]>([]);

  const showInputRef = ref(false);
  const inputPathRef = ref<InputInst>();
  const inputPathValueRef = ref("");

  const back = () => {
    if (!unref(backable)) return;

    unref(pathForwardHistory).push(unref(currentPath));

    to(unref(pathBackHistory).pop()!, true);
  };

  const forward = () => {
    if (!unref(forwardable)) return;

    unref(pathBackHistory).push(unref(currentPath));

    to(unref(pathForwardHistory).pop()!, true);
  };

  // replace是否记录历史，默认为true，相当于vue路由的push、replace方法，一个记录hashHistory， 一个不记录
  const to = (path: string, replace = false) => {
    if (unref(currentPath) === path) return;

    if (!replace && unref(currentPath) !== path) {
      unref(pathBackHistory).push(unref(currentPath) || path);
      pathForwardHistory.value = [];
    }

    currentPath.value = path;
  };

  const handleToPath = (pathSplitList: string[], startIndex: number) => {
    const resPathList = pathSplitList.slice(0, startIndex + 1);

    const resPath = resPathList.join("/");

    to(resPath);
  };

  const backable = computed(() => {
    return unref(pathBackHistory).length > 1;
  });

  const forwardable = computed(() => {
    return unref(pathForwardHistory).length > 0;
  });

  const handleClickBreadcrumb = (event: MouseEvent) => {
    eventStopPropagation(event);
    inputPathValueRef.value = unref(currentPath);
    showInputRef.value = true;
    nextTick(() => {
      unref(inputPathRef)?.select();
    });
  };

  const handleInputJump = (event: KeyboardEvent) => {
    eventStopPropagation(event);
    if (event.key === "Enter") {
      to(unref(inputPathValueRef));
      handleCancelInput();
    }
  };

  const handleCancelInput = () => {
    showInputRef.value = false;
  };

  const handleReload = () => {
    paginationRef.current = 1;
    paginationRef.total = 0;
    paginationRef.full = false;
    loadDirContent(true);
  };

  const renderToolbar = () => {
    const canBack = unref(backable);
    const canForward = unref(forwardable);

    return (
      <div class="file-manager-breadcrumb__toolbar">
        {/* 后退 */}
        <div
          class={[
            "file-manager-breadcrumb__toolbar-item",
            !canBack && "is-disabled",
          ]}
          onClick={back}
        >
          <NIcon size={16}>
            <ArrowLeftOutlined />
          </NIcon>
        </div>
        {/* 前进 */}
        <div
          class={[
            "file-manager-breadcrumb__toolbar-item",
            !canForward && "is-disabled",
          ]}
          onClick={forward}
        >
          <NIcon size={16}>
            <ArrowRightOutlined />
          </NIcon>
        </div>
        {/* 刷新当前 */}
        <div
          class="file-manager-breadcrumb__toolbar-item"
          onClick={handleReload.bind(null)}
        >
          <NIcon size={16}>
            <ReloadOutlined />
          </NIcon>
        </div>
      </div>
    );
  };

  const renderBreadcrumb = () => {
    const pathList: string[] = [];

    if (unref(currentPath)) {
      let positionIndex = 0;
      const path = unref(currentPath);

      for (let i = 0, l = path.length; i < l; i++) {
        const curS = path[i];
        if (curS === "/") {
          if (path[i - 1] === "/" || path[i + 1] === "/") continue;
          pathList.push(path.slice(positionIndex, i));
          positionIndex = i + 1;
        }
      }
    }

    return (
      <div
        class="file-manager-breadcrumb__content"
        onClick={handleClickBreadcrumb}
      >
        {unref(showInputRef) ? (
          <NInput
            ref={(_ref) => {
              inputPathRef.value = _ref as any;
            }}
            size="small"
            bordered={false}
            themeOverrides={{ heightSmall: "26px" }}
            value={unref(inputPathValueRef)}
            onUpdate:value={(value) => {
              inputPathValueRef.value = value;
            }}
            onBlur={handleCancelInput}
            onKeydown={handleInputJump}
          />
        ) : (
          pathList.map((item, index) => (
            <div
              class="file-manager-breadcrumb__item"
              onClick={(event: MouseEvent) => {
                eventStopPropagation(event);
                handleToPath(pathList, index);
              }}
            >
              <span class="file-manager-breadcrumb__item-text">{item}</span>
              {index < pathList.length - 1 && (
                <NIcon
                  class="file-manager-breadcrumb__item-separator"
                  size={14}
                >
                  <RightOutlined />
                </NIcon>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const render = () => {
    return (
      <div class="file-manager-breadcrumb">
        {renderToolbar()}
        {renderBreadcrumb()}
      </div>
    );
  };

  return {
    to,
    render,
    back,
    forward,
    backable,
    forwardable,
  };
};
