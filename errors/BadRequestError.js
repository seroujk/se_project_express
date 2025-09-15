class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400; // HTTP Status code
  }
}

module.exports = BadRequestError;
