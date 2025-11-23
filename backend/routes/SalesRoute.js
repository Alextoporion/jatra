const router = require('express').Router();
const { createSale, getSalesHistory } = require('../controllers/SalesController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/create-sale', verifyToken, createSale);
router.get('/sales-history', verifyToken, getSalesHistory);

module.exports = router;