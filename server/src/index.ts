import "dotenv/config";
import "reflect-metadata";
import Application from "./application";

(async () => {
  const application = Application();
  await application.connect();
  await application.init();
})();
