import "dotenv/config";
import validateEnv from "./utils/validateEnv";
import App from "./app";
import ScoresController from "./scores/scores.controller";
validateEnv();
const app = new App([
    new ScoresController(),
], 5000);
app.listen();
//# sourceMappingURL=server.js.map