const router = require("express").Router();
const {
  validateClothingItemBody,
  validateItemIds,
} = require("../middlewares/validation");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingitems");
const { authorize } = require("../middlewares/auth");

router.get("/items", getClothingItems);
router.post("/items", authorize, validateClothingItemBody, createClothingItem);
router.delete("/items/:itemId", authorize, validateItemIds, deleteClothingItem);
router.put(
  "/items/:itemId/likes",
  authorize,
  validateItemIds,
  likeClothingItem
);
router.delete(
  "/items/:itemId/likes",
  authorize,
  validateItemIds,
  unlikeClothingItem
);

module.exports = router;
