import { isAsyncFunction } from "./isAsyncFunction";

/**
 * 检查函数的返回值是否为 Promise
 * @param p
 * @returns
 */
export const isPromise = (p: any) => {
  return (
    isAsyncFunction(p) ||
    (typeof p === "object" && typeof p?.then === "function")
  );
};
