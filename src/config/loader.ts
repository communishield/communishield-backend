import { bind } from "@/di/container";
import { inject } from "inversify";
import { ConfigBuilder } from "./types/config-builder";
import { type ConfigLoader } from "./types/config-loader";
import { PartialConfigLoader } from "./types/partial-config-loader";

@bind("ConfigLoader")
export class ConfigLoaderImpl implements ConfigLoader {
  constructor(
    @inject("ConfigBuilder") private readonly configBuilder: ConfigBuilder,
    @inject("EnvPartialConfigLoader")
    private readonly envConnector: PartialConfigLoader,
  ) {}

  load() {
    const envConfig = this.envConnector.load();

    this.configBuilder.merge(envConfig);

    return this.configBuilder.build();
  }
}
