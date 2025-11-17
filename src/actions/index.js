import { apiServices } from "../apiservices/interceptor";

export const get = (path) => apiServices({ url: path, method: "get" }).then((res) => res?.data).catch((err) => err);
export const post = (path, obj) => apiServices({ url: path, method: "post", data: obj }).then((res) => res).catch((err) => err);
export const put = (path, obj, config = {}) => apiServices({ url: path, method: "put", data: obj, ...config }).then((res) => res).catch((err) => err);
export const patch = (path, obj) => apiServices({ url: path, method: "patch", data: obj }).then((res) => res).catch((err) => err);
export const del = (path, obj) => apiServices({ url: path, method: "delete", data: obj }).then((res) => res).catch((err) => err);