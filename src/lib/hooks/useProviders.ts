import { ref } from "vue";
import { FileManagerSpirit } from "../types/namespace";
import { ApiInterface } from "../enum/interface";

export const useProviders = ({
  $http,
}: {
  $http: FileManagerSpirit.AxiosRequest;
}) => {
  const providerList = ref<FileManagerSpirit.FileDirItem[]>([]);

  const getProviderList = async () => {
    try {
      const res = await $http.$request<FileManagerSpirit.FileDirItem[]>({
        url: ApiInterface.PROVIDER_LIST,
        method: "get",
      });

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
