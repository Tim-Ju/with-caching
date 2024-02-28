import { withCaching, setCache } from "../src";

const CACHE_KEY = "testAPI";

const testApi = ({
  value,
  cost = 0,
  error = "",
}: {
  value: string;
  cost?: number;
  error?: string;
}): Promise<string> => {
  return new Promise((resolve, r) => {
    if (error) r(error);
    if (cost > 0) {
      setTimeout(() => {
        resolve(value);
      }, cost);
    } else {
      resolve(value);
    }
  });
};

describe("Memory Cache Tests", () => {
  const cacheResult = "cacheResult";
  const newResult = "newResult";

  it("Get Cache when it does not exist", async () => {
    const requestResult = await withCaching(
      () => testApi({ value: newResult }),
      {
        key: CACHE_KEY,
      }
    );

    expect(requestResult).toEqual(newResult);
  });

  it("Get Cache when it is valid", async () => {
    setCache({
      key: CACHE_KEY,
      cache: {
        value: cacheResult,
        createdAt: Date.now(),
      },
      cacheType: "local",
    });

    const requestResult = await withCaching(
      () => testApi({ value: newResult }),
      {
        key: CACHE_KEY,
        cacheType: "local",
      }
    );

    expect(requestResult).toEqual(cacheResult);
  });

  it("Get Cache when it is inValid and data policy is priority-availability", async () => {
    setCache({
      key: CACHE_KEY,
      cache: {
        value: cacheResult,
        createdAt: -1,
      },
    });

    const requestResult = await withCaching(
      () => testApi({ value: newResult }),
      {
        key: CACHE_KEY,
      }
    );

    expect(requestResult).toEqual(newResult);
  });

  it("Get Cache when it is inValid and data policy is priority-timeliness", async () => {
    setCache({
      key: CACHE_KEY,
      cache: {
        value: cacheResult,
        createdAt: -1,
      },
    });

    const requestResult = await withCaching(
      () => testApi({ value: newResult }),
      {
        key: CACHE_KEY,
      }
    );

    expect(requestResult).toEqual(cacheResult);
  });
});
