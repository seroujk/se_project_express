const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/index");
const {DATA_NOT_FOUND_ERROR_CODE} = require ("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use(cors());
app.use(router);

// Handling all undefined routes (404)
app.use((req, res) => {
  res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: "Requested resource not found" });
});



app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
