import { Router } from 'express';

const authController = require('../controller/authController');

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
module.exports = router;
