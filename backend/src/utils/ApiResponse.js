class ApiResponse{
  constructor(statuscode, data, message, success) {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.success = success < 400
  }
}

export { ApiResponse }