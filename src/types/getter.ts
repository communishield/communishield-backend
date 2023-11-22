export type Getter<T extends Record<string, any>> = {
  get<K extends keyof T>(key: K): T[K];
};
