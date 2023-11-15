import { type Cache } from "@/cache/interfaces/cache";
import { NotFoundError } from "@/errors/not-found";
import { Mutex } from "async-mutex";
import { commandOptions, type RedisClientType } from "redis";

export class RedisCache implements Cache {
  static mutex = new Mutex();

  constructor(private readonly client: RedisClientType) {}

  async get(key: string): Promise<Buffer> {
    const result = await this.client.get(
      commandOptions({ returnBuffers: true }),
      key,
    );

    if (!result) {
      throw new NotFoundError("key not found");
    }

    return result;
  }

  async set(key: string, value: Buffer, ttl?: number): Promise<Buffer> {
    const result = await this.client.set(
      commandOptions({ returnBuffers: true }),
      key,
      value,
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        EX: ttl,
      },
    );

    if (!result) {
      throw new NotFoundError("key not found");
    }

    return result;
  }

  async atomicSet(key: string, value: Buffer, ttl?: number): Promise<Buffer> {
    return RedisCache.mutex.runExclusive(async () => this.set(key, value, ttl));
  }
}
