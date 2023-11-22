import { type Permission } from "./types/permission";

export type Directory = {
  name: string;
  _groupId: string;
  _directoryId: string;
  _ownerId: string;
  ownerPermissions: Permission[];
  groupPermissions: Permission[];
  otherPermissions: Permission[];
};
