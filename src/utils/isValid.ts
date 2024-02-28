const MAX_EXPIRED_TIME = 26 * 60 * 60;
/**
 * 判断缓存是否可用
 */
export const isValid = (cache: ICache, maxAge: number) => {
  const currentTime = Date.now();

  //可用条件：缓存存在、缓存hash与当前文件hash一致、缓存时间未超过最大缓存时间
  return (
    cache &&
    cache.value &&
    currentTime - cache.createdAt < (maxAge || MAX_EXPIRED_TIME)
  );
};
