import { ComputedRef, onBeforeUnmount, onMounted, Ref, ref, unref } from "vue";
import { eventStop } from "../utils/event";
import { debounce } from "lodash-es";

export const useDragInToggle = ({
  elementRef,
  dirPath,
  currentPath,
  onDrop,
}: {
  elementRef: Ref<HTMLDivElement | undefined>;
  dirPath: ComputedRef<string>;
  currentPath: Ref<string>;
  onDrop?: (event: DragEvent) => void;
}) => {
  const in_handler = (event: DragEvent) => {
    eventStop(event);
    if (unref(currentPath) === unref(dirPath)) {
      return;
    }
    unref(elementRef)?.classList.add("dragging-in");
  };

  const leave_handler = (event: DragEvent) => {
    eventStop(event);
    unref(elementRef)?.classList.remove("dragging-in");
  };
  const debounce_in_handler = debounce(in_handler, 50);
  const debounce_leave_handler = debounce(leave_handler, 50);

  const drop_handler = (event: DragEvent) => {
    eventStop(event);
    if (unref(currentPath) === unref(dirPath)) {
      return;
    }
    onDrop?.(event);
  };

  onMounted(() => {
    const el = unref(elementRef);
    console.log(el);
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
