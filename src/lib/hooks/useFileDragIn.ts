import { onMounted, onUnmounted, ref, unref } from "vue";
import { eventStop } from "../utils/event";


export const useFileDragIn = ({ scope, onFileDragIn }: { scope: string, onFileDragIn: (files: FileList) => void }) => {
  
  const elRef = ref<HTMLDivElement>();

  const drop_event = (event: DragEvent) => {
    eventStop(event);
    const files = event.dataTransfer?.files
    if(files?.length) {
      onFileDragIn(files)
    }
  }

  onMounted(() => {
    const scopeElRef = document.querySelector<HTMLDivElement>(scope)
    if(!scopeElRef) return;
    elRef.value = scopeElRef;
    scopeElRef.addEventListener('dragover', eventStop, false);
    scopeElRef.addEventListener('dragenter', eventStop, false)
    scopeElRef.addEventListener('drop', drop_event, false);
  })
 
  onUnmounted(() => {
    const scopeElRef = unref(elRef);
    if(!scopeElRef) return;
    scopeElRef.removeEventListener('dragover', eventStop, false);
    scopeElRef.removeEventListener('dragenter', eventStop, false)
    scopeElRef.removeEventListener('drop', drop_event, false);
  })
  
}