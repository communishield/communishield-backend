import { bind } from "@/di/container";
import { type Directory } from "@/models/directory.model";
import { BaseRepository } from "./base.repository";

@bind("DirectoryRepository")
export class DirectoryRepository extends BaseRepository<Directory> {}
