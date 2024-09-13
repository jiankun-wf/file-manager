import { inject, provide } from "vue";
import { FileManagerSpirit } from "../types/namespace";

const ProviderMainKey = Symbol("FileManagerProvider");
const ProviderActionKey = Symbol("FileManagerAction");

export const createContext = (body: FileManagerSpirit.Context) => {
  provide(ProviderMainKey, body);
};

export const useContext = (): FileManagerSpirit.Context => {
  const body = inject<FileManagerSpirit.Context>(ProviderMainKey);
  if (!body) {
    throw new Error("useContext must be used within a Provider");
  }
  return body;
};

export const createActionContext = (body: FileManagerSpirit.ActionContext) => {
  provide(ProviderActionKey, body);
};

export const useActionContext = (): FileManagerSpirit.ActionContext => {
  const body = inject<FileManagerSpirit.ActionContext>(ProviderActionKey);
  if (!body) {
    throw new Error("useActionContext must be used within a Provider");
  }
  return body;
};
