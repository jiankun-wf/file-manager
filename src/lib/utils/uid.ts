export const uid = (prefix: string) => {
  const random = Math.random().toString(36).slice(2);
  const timestamp = new Date().getTime().toString(36);
  return `${prefix}_${timestamp}_${random}`;
};
