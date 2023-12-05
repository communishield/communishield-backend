import { bind } from "@/di/container";
import { inject } from "inversify";
import { ConfigBuilder } from "./types/config-builder";
import { type ConfigLoader } from "./types/config-loader";
import { PartialConfigLoader } from "./types/partial-config-loader";
import { type Config } from "./schemas";

@bind("ConfigLoader")
export class ConfigLoaderImpl implements ConfigLoader {
  private readonly config: Config;

  constructor(
    @inject("ConfigBuilder") configBuilder: ConfigBuilder,
    @inject("EnvPartialConfigLoader")
    envConnector: PartialConfigLoader,
  ) {
    const envConfig = envConnector.load();

    configBuilder.merge(envConfig);

    this.config = configBuilder.build();
  }

  load() {
    return this.config;
  }
}
