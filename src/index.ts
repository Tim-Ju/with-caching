import localforage from "localforage";
import { isPromise } from "./utils/isPromise";
import { isValid } from "./utils/isValid";

/** Config localforage */
// localforage.config({
//   driver: [localforage.WEBSQL, localforage.INDEXEDDB, localforage.LOCALSTORAGE],
//   name: "With-Caching",
// });

/** Declare memory cache */
const cacheStore: Record<string, ICache> = {};

/** Config localforage */
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
  name: "With-Caching",
});

/**
 * Get cache from memory cache or local cache
 * @param params
 */
export const getCache = async (params: {
  key: string;
  cacheType: TCacheType;
}) => {
  const { key, cacheType } = params;
  let cache;

  if (cacheType === "local") {
    cache = await localforage.getItem(key);
  } else {
    cache = cacheStore[key];
  }
  return cache;
};

/**
 * Set cache
 * @param params
 */
export const setCache = async (params: {
  key: string;
  cacheType?: TCacheType;
  cache: ICache;
}) => {
  const { key, cacheType = "memory", cache } = params;
  if (cacheType === "local") {
    await localforage.setItem(key, cache);
  } else {
    cacheStore[key] = cache;
  }
};

/** Asynchronously update the cache with the data returned from the request. */
const updateCacheAfterRequest = async (params: {
  fetcher: TFetcher;
  key: string;
  cacheType: TCacheType;
}) => {
  const { fetcher, key, cacheType } = params;
  setTimeout(async () => {
    try {
      const re = await fetcher();
      await setCache({
        key,
        cacheType,
        cache: {
          value: re,
          createdAt: Date.now(),
        },
      });
    } catch (e) {
      throw e;
    }
  });
};

/** Get data from the request and update the cache asynchronously. */
const getDataFromRequest = async (params: {
  fetcher: TFetcher;
  key: string;
  cacheType: TCacheType;
}) => {
  const { fetcher, key, cacheType } = params;
  let re: any = null;
  try {
    re = await fetcher();
    setTimeout(async () => {
      await setCache({
        key,
        cacheType,
        cache: {
          value: re,
          createdAt: Date.now(),
        },
      });
    });
  } catch (e) {
    throw e;
  }

  return re;
};

/** */
export const withCaching = async (
  fetcher: TFetcher,
  options: TCacheOptions
) => {
  const start = Date.now();
  const {
    key,
    expiration = 300, // Default cache time: 300 seconds
    cacheType = "memory", // Default cache type: memory
    dataPolicy = "priority-availability", // Default data policy: priority-availability
  } = options;

  /** If no key is passed in, it means do not use the cache, directly return the request. */
  if (!key) {
    return fetcher();
  }

  const cache = await getCache({ key, cacheType });
  if (cache) {
    /** If the cache exists, determine whether the cache has expired to decide whether to return the data. */
    if (isValid(cache, expiration)) {
      return cache?.value;
    }
    /** If the cache does not exist, directly use the requested data as the return data and then update the cache. */
    /** Determine whether to prioritize returning data or ensuring data availability based on the data policy. */
    if (dataPolicy === "priority-availability") {
      return getDataFromRequest({
        key,
        fetcher,
        cacheType,
      });
    }
    updateCacheAfterRequest({
      key,
      fetcher,
      cacheType,
    });
    return cache?.value;
  }

  /** If the cache does not exist, directly use the requested data as the return data and then update the cache. */
  return getDataFromRequest({
    key,
    fetcher,
    cacheType,
  });
};
