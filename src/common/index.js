class AppError {
  message;
  status;
  constructor(message = '', status = 400) {
    this.message = message;
    this.status = status;
  }
}

class AppResponse {
  data;
  message;
  status;
  constructor(data = null, message = 'Ok', status = 200) {
    this.data = data;
    this.message = message;
    this.status = status;
  }
}

module.exports = {
  AppError,
  AppResponse,
};
