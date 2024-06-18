export const getFileExtension = (filename: string) => {
  const reg = /^(.+?)\.([a-zA-Z0-9]+)$/;
  const match = filename.match(reg);
  if (match) {
    const fileName = match[1];
    const fileExt = match[2];

    return { fileName, fileExt };
  }
};
