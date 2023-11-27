/* eslint-disable new-cap */
import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { FileDescriptor } from "./file-descriptor.model";

@Entity()
export class File {
  @PrimaryKey({ hidden: true })
  id!: number;

  @Property({ type: "json" })
  data!: Record<string, unknown>;

  @OneToOne(() => FileDescriptor, (descriptor) => descriptor.file, {
    owner: true,
  })
  descriptor!: FileDescriptor;
}
