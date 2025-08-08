const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingitems");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use(cors());

//Routers
app.use(usersRouter);
app.use(clothingItemsRouter);

//Handling all undefined routes (404)
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});



app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
