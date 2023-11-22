import { bind } from "@/di/container";
import { type File } from "@/models/file.model";
import { BaseRepository } from "./base.repository";

@bind("FileRepository")
export class FileRepository extends BaseRepository<File> {}
