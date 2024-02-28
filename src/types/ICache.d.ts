interface ICache {
  /** 缓存数据 */
  value: any;

  /** 缓存创建时间, 时间戳 */
  createdAt: number;

  /** 缓存所对应的文件hash */
  hash?: string;
}

type TFetcher = () => Promise<any>;

type TCacheOptions = {
  /** Cache Key */
  key?: string;

  /** Cache Type: Memory Cache, Local Cache, default is Memory Cache */
  cacheType?: TCacheType;

  /** Cache return Strategy */
  dataPolicy?: TDataPolicy;

  /** Maximum time of validity for cache, unit: second */
  expiration?: number;

  /** backup policy */
  useBackupData?: any;
};

type TCacheType = "memory" | "local";

type TDataPolicy = "priority-availability" | "priority-timeliness";
