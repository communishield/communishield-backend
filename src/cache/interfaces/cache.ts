export type Cache = {
  get(key: string): Promise<Buffer>;
  set(key: string, value: Buffer, ttl?: number): Promise<Buffer>;
  atomicSet(key: string, value: Buffer, ttl?: number): Promise<Buffer>;
};
