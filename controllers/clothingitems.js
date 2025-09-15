const ClothingItem = require("../models/clothingitem");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

// GET /items - return all clothing items
module.exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send(clothingItems))
    .catch((err) => {
      next(err);
    });
};

// POST /items - create a clothing item
module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((clothingItem) => res.status(201).send(clothingItem))
    .catch((error) => {
      if (error.name === "ValidationError") {
        const err = new BadRequestError("Invalid Clothing Item Data");
        return next(err);
      }
      return next(error);
    });
};

// DELETE /items/:itemId - delete a clothing item
module.exports.deleteClothingItem = (req, res, next) => {
  const owner = req.user._id;
  ClothingItem.findById(req.params.itemId)
    .then((clothingItem) => {
      if (!clothingItem) {
        const err = new NotFoundError("Item not found");
        return next(err);
      }
      if (clothingItem.owner.toString() !== owner) {
        const err = new ForbiddenError(
          "You cannot delete another user's items"
        );
        return next(err);
      }
      return clothingItem
        .deleteOne()
        .then(() => {
          return res.send({ message: "Item successfully deleted" });
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new BadRequestError("Invalid ID format");
        return next(error);
      }
      return next(err);
    });
};

// PUT /items/:itemId/likes - like an item
module.exports.likeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItem) => {
      if (!clothingItem) {
        const err = new NotFoundError("Item not found");
        return next(err);
      }
      return res.send(clothingItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new BadRequestError("Invalid ID format");
        return next(error);
      }
      return next(err);
    });
};

// DELETE /items/:itemId/likes - unlike an item
module.exports.unlikeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((clothingItem) => {
      if (!clothingItem) {
        const err = new NotFoundError("Item not found");
        return next(err);
      }
      return res.send(clothingItem);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new BadRequestError("Invalid ID format");
        return next(error);
      }
      return next(err);
    });
};
