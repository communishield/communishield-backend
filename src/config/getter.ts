import { type Getter } from "@/types/getter";
import { type Config } from "./schemas";
import { inject } from "inversify";
import { ConfigLoader } from "./types/config-loader";
import { bind } from "@/di/container";

@bind("ConfigGetter")
export class ConfigGetter implements Getter<Config> {
  private readonly _config: Config;

  constructor(
    @inject("ConfigLoader") private readonly configLoader: ConfigLoader,
  ) {
    this._config = this.configLoader.load();
  }

  get<T extends keyof Config>(key: T): Config[T] {
    return this._config[key];
  }
}
