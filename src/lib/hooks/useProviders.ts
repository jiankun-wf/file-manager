import { ref, unref } from "vue";
import { FileManagerSpirit } from "../types/namespace";

export const useProviders = ({ $http }: { $http: FileManagerSpirit.$fapi }) => {
  const providerList = ref<FileManagerSpirit.FileDirItem[]>([]);

  const getProviderList = async () => {
    try {
      const res = await unref($http).PROVIDER.list();

      const list = res.map<FileManagerSpirit.FileItem>((item: any) => ({
        name: item.rootUri,
        path: item.rootUri,
        size: 0,
        buket: true,
        dir: false,
        type: item.scheme,
        __FILE: null,
      }));
      providerList.value = list;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    providerList,
    getProviderList,
  };
};
