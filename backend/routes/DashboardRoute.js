const router = require('express').Router();
const { getDashboardStats } = require('../controllers/DashboardController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/dashboard-stats', verifyToken, getDashboardStats);

module.exports = router;