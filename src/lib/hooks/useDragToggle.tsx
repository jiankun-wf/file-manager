import { onBeforeUnmount, onMounted, Ref, ref, unref } from "vue";
import { eventStop } from "../utils/event";
import { debounce } from 'lodash-es'


export const useDragInToggle = ({
  elementRef,
}: {
  elementRef: Ref<HTMLDivElement | undefined>;
}) => {
  const isDragIn = ref(false);


  const in_handler = (event: DragEvent) => {
    eventStop(event);
    unref(elementRef)?.classList.add('dragging-in');
    console.log('in')
    isDragIn.value = true;
  };

  const leave_handler = (event: DragEvent) => {
    eventStop(event);
    unref(elementRef)?.classList.remove('dragging-in');
    isDragIn.value = false;
    console.log('leave');
  };
  const debounce_in_handler = debounce(in_handler, 50)
  const debounce_leave_handler = debounce(leave_handler, 50 )

  const drop_handler = (event: DragEvent) => {
    eventStop(event);
    isDragIn.value = false;
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

  return { isDragIn };
};
