import { uid } from "../utils/uid";

export const useChooseFile = () => {
  const id = uid("file-upload");

  const chooseFile = () => {
    return new Promise<File[] | null>((resolve) => {
      const input = document.getElementById(id) as HTMLInputElement;

      if (input) {
        input.onchange = () => {
          if (input.files) {
            const files = Array.from(input.files);
            resolve(files);
            input.value = "";
          }
        };
        input.click();
      } else {
        resolve(null);
      }
    });
  };

  const renderInputUpload = () => {
    return (
      <input
        type="file"
        id={id}
        multiple
        dir="true"
        style={{ display: "none!important" }}
      />
    );
  };

  return { chooseFile, renderInputUpload };
};
