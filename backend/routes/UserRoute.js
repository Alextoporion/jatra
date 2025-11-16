const { createStaff, loggingInStaff } = require('../controllers/UserController');
const fileUploader = require('../middlewares/FileUploader');

const router = require('express').Router();

router.post('/registerStaff',fileUploader.single('profileImage'),createStaff)
router.post('/loginStaff',loggingInStaff)
module.exports = router;