/**
 * 判断参数是否为异步函数
 * @param fn
 * @returns
 */
export const isAsyncFunction = (fn: any) => {
  return fn?.constructor?.name === "AsyncFunction";
};
