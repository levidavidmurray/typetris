import mongoose from "mongoose";
import cors from "cors";
import express from "express";

class App {
	public app: express.Application;
	public port: number;

	constructor(controllers, port) {
		this.app = express();
		this.port = port;

		this.connectToDatabase();
		this.initializeMiddleware();
		this.initializeControllers(controllers);
	}

	private initializeMiddleware() {
		this.app.use(cors());
		this.app.use(express.json());
	}

	private initializeControllers(controllers) {
		controllers.forEach((controller) => {
			this.app.use("/", controller.router);
		});
	}

	private connectToDatabase() {
		const {MONGO_USER, MONGO_PASS, MONGO_DB} = process.env;
		const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_DB}-ffsuz.mongodb.net/test?retryWrites=true&w=majority`;
		mongoose.connect(uri, {useNewUrlParser: true});
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`App listening on port ${this.port}`);
		});
	}
}

export default App;
