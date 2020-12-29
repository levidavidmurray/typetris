import axios from "axios";

class BaseApi {
	private API_URI: string = "http://localhost:3000/api";

	protected get(endpoint: string): Promise<any> {
		const path = `${this.API_URI}${endpoint}`;
		return axios.get(path);
	}

	protected post(endpoint: string, body: object): Promise<any> {
		const path = `${this.API_URI}${endpoint}`;
		return axios.post(path, body);
	}
}

export default BaseApi;
