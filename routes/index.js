const express = require('express');
const usersRouter = require("./users");
const clothingItemsRouter = require("./clothingitems");

const router = express.Router();

router.use(usersRouter);
router.use(clothingItemsRouter);


module.exports = router;

