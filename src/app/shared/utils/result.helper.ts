export interface ResultDto {
  code: number;
  message: string;
  success: boolean;
  data?: any;
}

export class Result {
  private _code!: number;
  private _message!: string;
  private _success!: boolean;
  private _data?: any;

  private constructor() {}

  private addData(data?: any): void {
    this._data = data;
  }

  private addError(code: number, message: string): void {
    this._code = code;
    this._message = message;
  }

  private toJSON(): ResultDto {
    return {
      message: this._message,
      code: this._code,
      success: this._success,
      data: this._data,
    };
  }

  public static error(code: number, message: string): ResultDto {
    const resultado = new Result();

    resultado.addError(code, message);

    return resultado.toJSON();
  }

  public static success(code: number, message: string, data: any): ResultDto {
    const result = new Result();

    result.addData(data);

    result._code = code;

    result._message = message;

    result._success = true;

    return result.toJSON();
  }
}
