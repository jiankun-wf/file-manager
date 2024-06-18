import Axios from "axios";
import { createDiscreteApi } from "naive-ui";

const { message: Message } = createDiscreteApi(["message"]);

const http = Axios.create({
  baseURL: "/basic-api",
});

http.interceptors.response.use(
  (res) => {
    const { data: response } = res;

    const { code, data, message } = response;

    if (code !== "200") {
      const m = `${res.config.url} Error：${message || "接口错误"}`;
      Message.error(m?.toString());
      throw new Error(m);
    }
    return data;
  },
  (err) => {
    const { config, response, code, message } = err;
    Message.error(
      `${config.url} Error：${response.status}（${code}）：${message}`
    );
  }
);

http.interceptors.request.use((config) => {
  // config.headers["Wi-Font-Authenticate"] =
  //   "37f46233-b8a8-4e4c-9d4d-418aea78e1cc";
  if (config.headers["Content-Type"] === "multipart/form-data" && config.data) {
    const formData = new FormData();
    for (const key in config.data) {
      formData.append(key, config.data[key]);
    }
  }
  return config;
});

export { http as $http };
