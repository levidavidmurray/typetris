import * as mongoose from "mongoose";
import * as cors from "cors";
import * as express from "express";
class App {
    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.connectToDatabase();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
    }
    initializeMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }
    connectToDatabase() {
        const { MONGO_USER, MONGO_PASS, MONGO_DB } = process.env;
        const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_DB}-ffsuz.mongodb.net/test?retryWrites=true&w=majority`;
        mongoose.connect(uri, { useNewUrlParser: true });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
}
export default App;
//# sourceMappingURL=app.js.map