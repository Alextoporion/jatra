// Make sure all imports are correct
const { itemPurchase, purchaseList } = require('../controllers/PurchaseController');
const fileUploader = require('../middlewares/FileUploader');
const verifyToken = require('../middlewares/verifyToken');

const router = require('express').Router();

router.post('/purchase', verifyToken, fileUploader.single('itemImage'), itemPurchase);

// --- FIX ---
// This route should also be protected.
// Anyone logged in can see the list.
router.get('/purchased-item', verifyToken, purchaseList); 

module.exports = router;