const router = require('express').Router();
const controller = require('../controllers/authController');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.put('/profile/:id', controller.updateProfile);

module.exports = router;
