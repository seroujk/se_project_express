require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const router = require("./routes/index");
const { DATA_NOT_FOUND_ERROR_CODE } = require("./utils/errors");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(router);
app.use(errorLogger); // enabling the error logger
// Handling all undefined routes (404)
app.use((req, res) => {
  res
    .status(DATA_NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

// celebrate error handler
app.use(errors());

// we handle all errors here, by logging the error to the console
// and sending a response with an appropriate status code and message
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
