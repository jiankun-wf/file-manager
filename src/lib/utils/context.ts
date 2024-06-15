import { inject, provide } from "vue";
import { FileManagerContext } from "../types";

export const providerKey = Symbol("FileManagerProvider");

export const createContext = (body: FileManagerContext) => {
  provide(providerKey, body);
};

export const useContext = (): FileManagerContext => {
  const body = inject<FileManagerContext>(providerKey);
  if (!body) {
    throw new Error("useContext must be used within a Provider");
  }
  return body;
};
