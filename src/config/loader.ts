import { type ConfigBuilder } from "./interfaces/builder";
import { type ConfigLoaderConnector } from "./interfaces/connector";
import { type ConfigLoader } from "./interfaces/loader";

export class ConfigLoaderImpl implements ConfigLoader {
  constructor(
    private readonly configBuilder: ConfigBuilder,
    private readonly connectors: ConfigLoaderConnector[],
  ) {}

  load() {
    for (const connector of this.connectors) {
      const config = connector.load();
      this.configBuilder.merge(config);
    }

    return this.configBuilder.build();
  }
}
