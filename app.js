const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingitems");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

//Routers
app.use(usersRouter);
app.use(clothingItemsRouter);

//Handling all undefined routes (404)
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

//Authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: '687d80ed2e552e4e33ad48a0'
  };
  next();
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
