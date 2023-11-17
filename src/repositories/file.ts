import { type File, FileFactory, FileSchema } from "@/models/file";
import { BaseMongooseRepository } from "./base/mongoose-repository";

export class FileRepository extends BaseMongooseRepository<File> {
  constructor() {
    super("File", new FileSchema(), new FileFactory());
  }
}
