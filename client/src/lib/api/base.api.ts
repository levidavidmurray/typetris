import axios from "axios";
import { Config } from "@/config";

class BaseApi {
  private API_URI: string = Config.isDev ? Config.api.DEV : Config.api.PROD;

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
