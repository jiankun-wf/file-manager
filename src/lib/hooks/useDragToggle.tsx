import { ComputedRef, onBeforeUnmount, onMounted, Ref, unref } from "vue";
import { eventStop } from "../utils/event";
import { debounce } from "lodash-es";
import { NK } from "../enum";
import { findParentPath, isCurrentPathParent } from "../utils/path";

export const useDragInToggle = ({
  elementRef,
  dirPath,
  contextDraggingArgs,
  onDrop,
}: {
  elementRef: Ref<HTMLDivElement | undefined>;
  dirPath: ComputedRef<string>;
  currentPath: Ref<string>;
  contextDraggingArgs: Ref<{
    dragging: "file" | "dir" | "mixed" | null;
    draggingPath: string;
  }>;
  onDrop?: (event: DragEvent) => void;
}) => {
  const in_handler = (event: DragEvent) => {
    eventStop(event);
    const { dragging, draggingPath } = unref(contextDraggingArgs);

    if (!draggingPath) return;
    if (!dragging) return;
    //拖拽对象是否包含当前拖拽目录
    // 举个栗子：如果当前拖拽的对象有 folder/a.png、folder/b.png folder/folder-child  两个文件，三个文件夹，那么folder/folder-child拖入事件中，
    // 当前拖拽对象 包含了本目录，那么不允许拖入，也不会触发拖入样式触发
    // 除此之外，可以正常出发拖入样式的切换
    const path_arr = draggingPath.split(NK.ARRAY_JOIN_SEPARATOR);
    if (
      path_arr.some(
        // 目录等于当前目录 或者 父目录等于当前目录 或者父目录拖拽进入子目录，这个也不被允许
        (p) =>
          p === unref(dirPath) ||
          findParentPath(p) === unref(dirPath) ||
          isCurrentPathParent(p, unref(dirPath))
      )
    )
      return;

    unref(elementRef)?.classList.add("dragging-in");
  };

  const leave_handler = (event: DragEvent) => {
    eventStop(event);
    unref(elementRef)?.classList.contains("dragging-in") &&
      unref(elementRef)?.classList.remove("dragging-in");
  };
  const debounce_in_handler = debounce(in_handler, 50);
  const debounce_leave_handler = debounce(leave_handler, 50);

  const drop_handler = (event: DragEvent) => {
    eventStop(event);
    const { dragging, draggingPath } = unref(contextDraggingArgs);
    if (!draggingPath) return;
    if (!dragging) return;

    const path_arr = draggingPath.split(NK.ARRAY_JOIN_SEPARATOR);
    if (
      path_arr.some(
        (p) => p === unref(dirPath) || findParentPath(p) === unref(dirPath)
      )
    )
      return;

    onDrop?.(event);
  };

  onMounted(() => {
    const el = unref(elementRef);
    if (!el) return;
    el.addEventListener("dragenter", debounce_in_handler);
    el.addEventListener("dragleave", debounce_leave_handler);
    el.addEventListener("dragover", eventStop);
    el.addEventListener("drop", drop_handler);
  });

  onBeforeUnmount(() => {
    const el = unref(elementRef);
    if (!el) return;
    el.removeEventListener("dragenter", debounce_in_handler);
    el.removeEventListener("dragleave", debounce_leave_handler);
    el.removeEventListener("dragover", eventStop);
    el.removeEventListener("drop", drop_handler);
  });
};
