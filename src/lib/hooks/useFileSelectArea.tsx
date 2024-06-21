import { computed, onMounted, Ref, ref, unref } from "vue";
import { AreaSelectParams } from "../types/drag";
import { FileItem } from "../types";
import { isAreaIntersect } from "../utils/area";
import { addMouseLeftEventListener, eventStop } from "../utils/event";

export const useAreaSelect = ({
  scope,
  draggable,
  fileList,
  selectedFiles,
}: {
  scope: string;
  draggable: Ref<boolean>;
  fileList: Ref<FileItem[]>;
  selectedFiles: Ref<FileItem[]>;
  onEnd?: (files: FileItem[]) => void;
}) => {
  const scopeEl = ref<HTMLElement>();
  const x = ref(0);
  const y = ref(0);
  const width = ref(0);
  const height = ref(0);
  const areaRef = ref<HTMLDivElement>();

  // 象限。1：左上，2：右上，3：左下，4：右下
  const direction = ref<1 | 2 | 3 | 4>(1);

  // 鼠标up时取消选择
  const show = ref(false);

  const areaStyle = computed(() => {
    const el = unref(scopeEl)!;

    if (!el) return {};
    const elRect = el.getBoundingClientRect();

    switch (unref(direction)) {
      case 1:
        return {
          top: Math.max(unref(y) - unref(height) - elRect.top, 0) + "px",
          left: Math.max(unref(x) - unref(width) - elRect.left, 0) + "px",
          width: unref(width) + "px",
          height: unref(height) + "px",
        };
      case 2:
        return {
          top: Math.max(unref(y) - unref(height) - elRect.top, 0) + "px",
          left: Math.max(unref(x) - elRect.left, 0) + "px",
          width: unref(width) + "px",
          height: unref(height) + "px",
        };
      case 3:
        return {
          top: Math.max(unref(y) - elRect.top, 0) + "px",
          left: Math.max(unref(x) - unref(width) - elRect.left, 0) + "px",
          width: unref(width) + "px",
          height: unref(height) + "px",
        };
      case 4:
        return {
          top: Math.max(unref(y) - elRect.top, 0) + "px",
          left: Math.max(unref(x) - elRect.left, 0) + "px",
          width: unref(width) + "px",
          height: unref(height) + "px",
        };
    }
  });

  const handleMoseDown = (e: MouseEvent) => {
    eventStop(e);
    x.value = e.clientX;
    y.value = e.clientY;
    width.value = 0;
    height.value = 0;
    show.value = true;
    unref(scopeEl)!.classList.add("is-selecting");
    draggable.value = false;
  };

  const handleMoseMove = (e: MouseEvent) => {
    eventStop(e);
    if (!unref(show)) return;
    const { clientX, clientY } = e;
    const ox = unref(x);
    const oy = unref(y);

    // 根据鼠标的移动方向跟鼠标初始按住的位置，计算象限
    if (clientX < ox && clientY < oy) {
      direction.value = 1;
    } else if (clientX > ox && clientY < oy) {
      direction.value = 2;
    } else if (clientX < ox && clientY > oy) {
      direction.value = 3;
    } else {
      direction.value = 4;
    }

    width.value = Math.abs(clientX - ox);
    height.value = Math.abs(clientY - oy);
    const selectFiles = getSelectFiles();
    if (!selectFiles) {
      return;
    }
    selectedFiles.value = selectFiles;
  };

  const handleMoseUp = (e: MouseEvent) => {
    eventStop(e);
    draggable.value = true;
    unref(scopeEl)!.classList.remove("is-selecting");
    const selectFiles = getSelectFiles();
    if (!selectFiles) return;

    selectedFiles.value = selectFiles;
    show.value = false;
  };

  const getSelectFiles = () => {
    if (!unref(show)) return false;
    // 抛出选择区域的面积
    const el = unref(areaRef)!;

    const position: AreaSelectParams = {
      top: Math.max(el.offsetTop, 0),
      left: Math.max(el.offsetLeft, 0),
      right: el.clientWidth + Math.max(el.offsetLeft, 0),
      bottom: el.clientHeight + Math.max(el.offsetTop, 0),
    };
    const files = unref(fileList).map((file) => {
      const el = document.querySelector<HTMLDivElement>(
        `div[data-path-name="${file.path}"]`
      )!;
      return {
        rect: {
          top: el.offsetTop,
          left: el.offsetLeft,
          right: el.offsetLeft + el.clientWidth,
          bottom: el.offsetTop + el.clientHeight,
        },
        file,
      };
    });
    const selectFiles = files.filter((file) => {
      const { rect } = file;
      return isAreaIntersect(position, rect);
    });
    return selectFiles.map((item) => item.file);
  };

  onMounted(() => {
    const el = document.getElementById(scope);
    if (!el) return;
    scopeEl.value = el;
    addMouseLeftEventListener(el, "mousedown", handleMoseDown);
    addMouseLeftEventListener(el, "mousemove", handleMoseMove);
    addMouseLeftEventListener(window, "mouseup", handleMoseUp);
  });

  const renderAreaEl = () => {
    if (!unref(show)) return null;
    return (
      <div
        class="filer-manager-area-select"
        ref={(ctx) => (areaRef.value = ctx as HTMLDivElement)}
        style={unref(areaStyle)}
      ></div>
    );
  };

  return { renderAreaEl };
};
