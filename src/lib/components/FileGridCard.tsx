import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  toRef,
  toRefs,
  unref,
  watch,
} from "vue";
import { FileItem } from "../types";
import { formatDate } from "../utils/date";
import { formatSize } from "../utils/size";
import { resizeImage } from "../utils/resize";

export const FileGridCard = defineComponent({
  name: "FileGridCard",
  props: {
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { fileList } = toRefs(props);
    return () => (
      <div class="file-manager__file-list--grid">
        {unref(fileList).map((f) => (
          <FileGridCardItem currentFile={f} />
        ))}
      </div>
    );
  },
});

const FileGridCardItem = defineComponent({
  props: {
    currentFile: {
      type: Object as PropType<FileItem>,
      required: true,
    },
  },
  setup(props) {
    const imageId = `file-manager-file-grid-thumb-image_${Math.random()
      .toString(24)
      .slice(2)}`;

    const currentFile = toRef(props, "currentFile");

    const getCurrentFileThumbnail = computed(() => {
      if (/image/.test(unref(currentFile).type)) {
        return unref(currentFile).url;
      }
      return new URL("@/assets/otherfile.png", import.meta.url).href;
    });

    onMounted(() => {
      unref(getCurrentFileThumbnail) &&
        resizeImage(
          unref(getCurrentFileThumbnail),
          document.getElementById(imageId) as HTMLImageElement,
          150,
          100
        );
    });
    return () => (
      <div class="file-manager__file-item--grid">
        <div class="file-manager__file-item__thumb">
          <img
            src={unref(getCurrentFileThumbnail)}
            alt={unref(currentFile).name}
            id={imageId}
          />
        </div>
        <div class="file-manager__file-item__info">
          <div class="file-manager__file-item__name">
            {unref(currentFile).name}
          </div>
          <div class="file-manager__file-item__time">
            {formatDate(unref(currentFile).uploadTime, "YYYY-MM-DD HH:mm:ss")}
          </div>
          <div class="file-manager__file-item__size">
            {formatSize(unref(currentFile).size)}
          </div>
        </div>
      </div>
    );
  },
});
