const { itemPurchase } = require('../controllers/PurchaseController');
const fileUploader = require('../middlewares/FileUploader');
const verifyToken = require('../middlewares/verifyToken');

const router = require('express').Router();

router.post('/purchase',verifyToken,fileUploader.single('itemImage'),itemPurchase);

module.exports = router;