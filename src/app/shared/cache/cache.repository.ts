import { RedisConnection } from "../../../main/database/ioredis.connection";

export class CacheRepository {
  private _redis = RedisConnection.connection;

  async get<T>(key: string): Promise<T | null> {
    const data = await this._redis.get(key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  async set<T>(key: string, data: T): Promise<"OK"> {
    const dataStr = JSON.stringify(data);

    return this._redis.set(key, dataStr);
  }

  async delete(key: string): Promise<number> {
    return this._redis.del(key);
  }
}
