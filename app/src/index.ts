import "reflect-metadata";
import "@/di/deps-loader";
import { container } from "./di/container";
import { type Client } from "./types/client";
import { type Logger } from "./types/logger";

container
  .get<Client>("ServerClient")
  .run()
  .catch((error) => {
    container.get<Logger>("Logger").error(`An error occured: ${error}`);
  });
