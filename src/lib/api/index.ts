export const getDirsList = async () => {
  const req = await fetch("/basic-api/dirs");

  return req.json();
};

export const getDirFiles = async (dir: string) => {
  const req = await fetch(`/basic-api/dir-file?dir=${dir}`);
  return req.json();
};
