const router = require('express').Router();
const { submitDailyReport } = require('../controllers/ReportController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/submit-daily-report', verifyToken, submitDailyReport);

module.exports = router;