const express = require('express');
const router = express.Router();
const { register, login, checkEmail, getCsrfToken, verifyEmail, resendVerification, refresh, logout, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, checkEmailValidation, resendVerificationValidation } = require('../middleware/validation');
const { rateLimit } = require('../middleware/rateLimit');
const { captchaGuard } = require('../middleware/captcha');

const loginRegisterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyPrefix: 'auth-login-register',
  message: 'Too many authentication attempts. Please wait and try again.',
});

const checkEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  keyPrefix: 'auth-check-email',
  message: 'Too many email checks. Please wait and try again.',
});

router.post('/register', loginRegisterLimiter, captchaGuard('register'), registerValidation, register);
router.post('/login', loginRegisterLimiter, captchaGuard('login'), loginValidation, login);
router.post('/check-email', checkEmailLimiter, captchaGuard('check-email'), checkEmailValidation, checkEmail);
router.post('/resend-verification', checkEmailLimiter, captchaGuard('check-email'), resendVerificationValidation, resendVerification);
router.get('/verify-email', verifyEmail);
router.get('/csrf', getCsrfToken);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, loginRegisterLimiter, changePassword);

module.exports = router;
