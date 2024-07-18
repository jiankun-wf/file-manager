import { inject, provide } from "vue";
import { FileManagerSpirit } from "../types/namespace";

export const providerKey = Symbol("FileManagerProvider");

export const createContext = (body: FileManagerSpirit.Context) => {
  provide(providerKey, body);
};

export const useContext = (): FileManagerSpirit.Context => {
  const body = inject<FileManagerSpirit.Context>(providerKey);
  if (!body) {
    throw new Error("useContext must be used within a Provider");
  }
  return body;
};
