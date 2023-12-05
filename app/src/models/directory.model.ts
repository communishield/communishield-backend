/* eslint-disable new-cap */
import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
} from "@mikro-orm/core";
import { FileDescriptor } from "./file-descriptor.model";

@Entity()
export class Directory {
  @PrimaryKey({ hidden: true })
  id!: number;

  @OneToMany({
    entity: () => FileDescriptor,
    mappedBy: "parentDirectory",
    orphanRemoval: true,
  })
  contents = new Collection<FileDescriptor>(this);

  @OneToOne(() => FileDescriptor, (descriptor) => descriptor.directory, {
    owner: true,
    orphanRemoval: true,
  })
  descriptor!: FileDescriptor;
}
