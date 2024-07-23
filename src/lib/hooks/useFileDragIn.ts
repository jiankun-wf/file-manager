import { onBeforeUnmount, onMounted, ref, unref } from "vue";
import { eventStop } from "../utils/event";
import { splitDragFiles } from "../utils/drag";
import { DragInFileItem } from "../types/drag";

export const useFileDragIn = ({
  scope,
  onFileDragIn,
}: {
  scope: string;
  onFileDragIn: (files: DragInFileItem[]) => void;
}) => {
  const elRef = ref<HTMLDivElement>();

  const drop_event = async (event: DragEvent) => {
    eventStop(event);
    const types = event.dataTransfer?.types ?? [];

    if (types.some((type) => type !== "Files")) {
      return;
    }

    const items = event.dataTransfer?.items;

    if (!items?.length) {
      return;
    }

    const fileAndDirList = await splitDragFiles(Array.from(items));

    onFileDragIn?.(fileAndDirList);
  };

  onMounted(() => {
    const scopeElRef = document.querySelector<HTMLDivElement>(scope);
    if (!scopeElRef) return;
    elRef.value = scopeElRef;
    scopeElRef.addEventListener("dragover", eventStop, false);
    scopeElRef.addEventListener("dragenter", eventStop, false);
    scopeElRef.addEventListener("drop", drop_event, false);
  });

  onBeforeUnmount(() => {
    const scopeElRef = unref(elRef);
    if (!scopeElRef) return;
    scopeElRef.removeEventListener("dragover", eventStop, false);
    scopeElRef.removeEventListener("dragenter", eventStop, false);
    scopeElRef.removeEventListener("drop", drop_event, false);
  });
};
