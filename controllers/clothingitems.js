const clothingitem = require("../models/clothingitem");
const ClothingItem = require("../models/clothingitem");
const {
  INVALID_DATA_ERROR_CODE,
  SERVER_ERROR_CODE,
  DATA_NOT_FOUND_ERROR_CODE,
  UNAUTHORIZED_DATA_CODE,
} = require("../utils/errors");

// GET /items - return all clothing items
module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send(clothingItems))
    .catch(() =>
      res.status(SERVER_ERROR_CODE).send({ message: "Server error" })
    );
};

// POST /items - create a clothing item
module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(201).send(clothingItem))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid clothing item data" });
      }
      res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};

// DELETE /items/:itemId - delete a clothing item
module.exports.deleteClothingItem = (req, res) => {
  const owner = req.user._id;
  ClothingItem.findById(req.params.itemId)
    .then((clothingItem) => {
      if (!clothingItem) {
        return res
          .status(DATA_NOT_FOUND_ERROR_CODE)
          .send({ message: "Item Not Found" });
      } else if (clothingItem.owner.toString() !== owner) {
        return res
          .status(UNAUTHORIZED_DATA_CODE)
          .send({ message: "You cannot delete another user's items" });
      }
      clothingItem
        .deleteOne()
        .then(() => {
          return res.send({ message: "Item successfully deleted" });
        })
        .catch((err) => {
          return res
            .status(SERVER_ERROR_CODE)
            .send({ message: `Deletion Error: ${err}` });
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid ID format" });
      }
      res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};

// PUT /items/:itemId/likes - like an item
module.exports.likeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItem) => {
      if (!clothingItem) {
        return res
          .status(DATA_NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      res.send(clothingItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid ID format" });
      }
      res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};

// DELETE /items/:itemId/likes - unlike an item
module.exports.unlikeClothingItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItem) => {
      if (!clothingItem) {
        return res
          .status(DATA_NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      res.send(clothingItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Invalid ID format" });
      }
      res.status(SERVER_ERROR_CODE).send({ message: "Server error" });
    });
};
