export type Model = {
  data: Record<string, unknown>;
  toString(): string;
  toObject(): Record<string, unknown>;
};
