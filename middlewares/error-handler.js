function errorHandler(err, req, res, next) {
  console.error(err); // Logs the error for debugging

  // Use error status if av ailable, else default to 500
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  res.status(statusCode).send({ message });
}

module.exports = errorHandler;