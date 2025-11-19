const router = require('express').Router();
const { addProduction, getFinishedStock } = require('../controllers/ProductionController');
const verifyToken = require('../middlewares/verifyToken');


// Route: POST /api/add-production
router.post('/add-production', verifyToken, addProduction);
router.get('/finished-stock', verifyToken, getFinishedStock);

module.exports = router;