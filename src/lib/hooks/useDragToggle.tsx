import { onBeforeUnmount, onMounted, Ref, ref, unref } from "vue";
import { eventStop } from "../utils/event";

export const useDragInToggle = ({
  elementRef,
}: {
  elementRef: Ref<HTMLDivElement | undefined>;
}) => {
  const isDragIn = ref(false);

  const in_handler = (event: DragEvent) => {
    eventStop(event);
    isDragIn.value = true;
    console.log(true);
  };

  const leave_handler = (event: DragEvent) => {
    eventStop(event);
    isDragIn.value = false;
    console.log(false);
  };

  const drop_handler = (event: DragEvent) => {
    eventStop(event);
    isDragIn.value = false;
  };

  onMounted(() => {
    const el = unref(elementRef);
    if (!el) return;
    el.addEventListener("dragenter", in_handler, false);
    el.addEventListener("dragleave", leave_handler, false);
    el.addEventListener("dragover", eventStop, false);
    el.addEventListener("drop", drop_handler, false);
  });

  onBeforeUnmount(() => {
    const el = unref(elementRef);
    if (!el) return;
    el.removeEventListener("dragenter", in_handler, false);
    el.removeEventListener("dragleave", leave_handler, false);
    el.removeEventListener("dragover", eventStop, false);
    el.removeEventListener("drop", drop_handler, false);
  });

  return { isDragIn };
};
