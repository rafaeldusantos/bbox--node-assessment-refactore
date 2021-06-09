export default class HttpException extends Error {
  status: number;
  message: string;
  detail: object;
  constructor(status: number, message: string, detail?: object) {
    super(message);
    this.status = status;
    this.message = message;
    this.detail = detail || undefined;
  }
}
