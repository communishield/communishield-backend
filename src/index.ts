import "reflect-metadata";
import { ContainerLoader } from "./di/container";
import { type ApplicationRunner } from "./application/interfaces/runner";
import { types } from "./types";

async function main() {
  const container = await new ContainerLoader().load();
  const app = container.get<ApplicationRunner>(types.runner);

  await app.run();
}

main().catch(() => {
  process.exit(1);
});
