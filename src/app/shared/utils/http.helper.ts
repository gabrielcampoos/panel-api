import { Response } from "express";
import { ResultDto } from "./result.helper";

class HttpHelper {
  public success(response: Response, result: ResultDto) {
    return response.status(result.code ?? 200).send(result);
  }

  public serverError(response: Response, result: ResultDto) {
    return response.status(result.code ?? 500).send(result);
  }

  public badRequestError(response: Response, result: ResultDto) {
    return response.status(result.code ?? 400).send(result);
  }
}

export const httpHelper = new HttpHelper();
