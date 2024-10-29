import { NDropdown, type DropdownOption } from "naive-ui";
import { nextTick, Ref, ref, unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";

export const useContextMenu = ({
  options,
  onSelect,
  isOnlyRead,
}: {
  options: Ref<DropdownOption[]>;
  onSelect: (
    key: string | number,
    option: DropdownOption,
    ...args: any[]
  ) => void;
  isOnlyRead: FileManagerSpirit.Context["isOnlyRead"];
}) => {
  const x = ref(0);
  const y = ref(0);

  const showRef = ref(false);

  const argsList = ref<any[]>([]);

  const handleContextMenu = (event: MouseEvent, ...args: any[]) => {
    event.stopPropagation();
    event.preventDefault();
    showRef.value = false;

    if (unref(isOnlyRead)) return;

    argsList.value = args;
    nextTick(() => {
      x.value = event.clientX;
      y.value = event.clientY;
      showRef.value = true;
    });
  };

  const handleClickOutside = () => {
    showRef.value = false;
  };

  const handleSelect = (key: string | number, option: DropdownOption) => {
    showRef.value = false;
    onSelect(key, option, ...unref(argsList));
  };

  const renderContextMenu = () => {
    return (
      <NDropdown
        x={unref(x)}
        y={unref(y)}
        placement="bottom-start"
        trigger="manual"
        show={unref(showRef)}
        onClickoutside={handleClickOutside}
        options={unref(options)}
        onSelect={handleSelect}
        size="small"
      ></NDropdown>
    );
  };

  return { renderContextMenu, handleContextMenu };
};
