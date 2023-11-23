import { Directory } from "./models/directory.model";
import { FileDescriptor } from "./models/file-descriptor.model";
import { File } from "./models/file.model";
import { Group } from "./models/group.model";
import { User } from "./models/user.model";

export default {
  entities: [Directory, FileDescriptor, File, Group, User],
  clientUrl: "postgresql://user:password@localhost:5432/communishield",
  type: "postgresql",
};
