import mongoose from "mongoose";
import { z } from "zod";
import { Entity, type EntityData } from "./base/entity";
import { BaseMongooseSchema } from "./base/base-mongoose-schema";
import { BaseModelFactory } from "./base/factory";

export type FileData = {
  name: string;
  owner: string;
  group: string;
  directory: string;
  permissions: {
    read: string[];
    write: string[];
  };
} & EntityData;

export class File extends Entity<FileData> {}

export class FileSchema extends BaseMongooseSchema<File> {
  constructor() {
    super(
      {
        name: z.string(),
        owner: z.string(),
        group: z.string(),
        directory: z.string(),
        permissions: z.object({
          read: z.array(z.string()),
          write: z.array(z.string()),
        }),
      },
      {
        name: {
          type: String,
          required: true,
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        group: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
          required: true,
        },
        directory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Directory",
          required: true,
        },
        permissions: {
          read: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
          write: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
        },
      },
    );
  }
}

export class FileFactory extends BaseModelFactory<File> {
  constructor() {
    super(File, new FileSchema());
  }
}
