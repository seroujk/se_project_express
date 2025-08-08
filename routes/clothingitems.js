const router = require('express').Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem
} = require('../controllers/clothingitems');
const {authorize} = require('../middlewares/auth');


router.get('/items', getClothingItems);
router.post('/items', authorize, createClothingItem);
router.delete('/items/:itemId',authorize, deleteClothingItem);
router.put('/items/:itemId/likes', authorize, likeClothingItem);
router.delete('/items/:itemId/likes', authorize, unlikeClothingItem);

module.exports = router;