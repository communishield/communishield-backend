import { type Permission } from "@/models/permission.model";

export type DirectoryDto = {
  path: string[];
  contents: Array<{
    name: string;
    type: "file" | "directory";
    owner: string;
    group: string;
    permissions: Permission;
  }>;
  owner: string;
  group: string;
  permissions: Permission;
};
