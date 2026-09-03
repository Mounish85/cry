const { Router } = require('express');
const { signup_post, login_post, profile_get,logout_get } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();
router.post('/signup', signup_post);
router.post('/login', login_post);
router.get('/profile', requireAuth, profile_get);
router.get('/logout',logout_get);

module.exports = router;
