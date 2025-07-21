const router = require('express').Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem
} = require('../controllers/clothingitems');

router.use((req, res, next)=>{
  req.user = {_id:'64b9e7e12f8e5e1234567890'}
  next();
});

router.get('/items', getClothingItems);
router.post('/items', createClothingItem);
router.delete('/items/:itemId', deleteClothingItem);
router.put('/items/:itemId/likes', likeClothingItem);
router.delete('/items/:itemId/likes', unlikeClothingItem);

module.exports = router;