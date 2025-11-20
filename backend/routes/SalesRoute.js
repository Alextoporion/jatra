const router = require('express').Router();
const { createSale } = require('../controllers/SalesController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/create-sale', verifyToken, createSale);

module.exports = router;