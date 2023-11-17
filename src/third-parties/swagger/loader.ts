import { Config } from "@/config/schemas";
import { types } from "@/types";
import { inject, injectable } from "inversify";
import fs from "fs";
import { parse } from "yaml";

@injectable()
export class SwaggerLoader {
  private readonly specsPath: string;

  constructor(@inject(types.config) config: Config) {
    this.specsPath = config.swaggerSpecsPath;
  }

  async load() {
    const specs = await fs.promises.readFile(this.specsPath, "utf8");

    return parse(specs) as Record<string, unknown>;
  }
}
