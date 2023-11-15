import { ApplicationLoaderImpl } from "./application/loader";

async function main() {
  const app = await new ApplicationLoaderImpl().load();
  await app.run();
}

main()
  .then(() => {
    console.log("done");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
