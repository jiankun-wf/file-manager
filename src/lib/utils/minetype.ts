export const isImage = (filetype: string) => {
  return (filetype ?? "").startsWith("image/");
};

export const fileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const exportCavansImage = (
  canvas: HTMLCanvasElement,
  type = "image/png",
  quality = 1
) => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export canvas as blob"));
        }
      },
      type,
      quality
    );
  });
};
