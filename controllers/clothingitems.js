const ClothingItem = require("../models/clothingitem");

// GET /items - return all clothing items
module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send(clothingItems))
    .catch(() => res.status(500).send({ message: "Server error" }));
};

// POST /items - create a clothing item
module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(201).send(clothingItem))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid clothing item data" });
      }
      res.status(500).send({ message: "Server error" });
    });
};

// DELETE /items/:itemId - delete a clothing item
module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .then((clothingItem) => {
      if (!clothingItem) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send({ message: "Item successfully deleted" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID format" });
      }
      res.status(500).send({ message: "Server error" });
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
        return res.status(404).send({ message: "Item not found" });
      }
      res.send(clothingItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID format" });
      }
      res.status(500).send({ message: "Server error" });
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
        return res.status(404).send({ message: "Item not found" });
      }
      res.send(clothingItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID format" });
      }
      res.status(500).send({ message: "Server error" });
    });
};
