import BaseApi from "@/lib/api/base.api";
import { Score } from "@/lib/types/score.interface";
import { AxiosPromise } from "axios";

class ScoreApi extends BaseApi {
  constructor() {
    super();
  }

  public getTopTen(): AxiosPromise<Score[]> {
    return this.get("/scores");
  }

  public submitScore(score: Score): AxiosPromise<Score> {
    return this.post("/scores", { score });
  }
}

export default ScoreApi;
