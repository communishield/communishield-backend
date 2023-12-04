import { type Permission } from "@/models/permission.model";

export type FileDto = {
  path: string[];
  data: Record<string, any>;
  owner: string;
  group: string;
  permissions: Permission;
};
