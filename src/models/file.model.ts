import { type Permission } from "./types/permission";

export type File = {
  name: string;
  data: Record<string, unknown>;
  _groupId: string;
  _directoryId: string;
  _ownerId: string;
  ownerPermissions: Permission[];
  groupPermissions: Permission[];
  otherPermissions: Permission[];
};
