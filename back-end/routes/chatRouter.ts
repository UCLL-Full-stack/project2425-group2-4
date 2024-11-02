import { Router } from 'express';

const chatController = require('../controller/chatController');

const router = Router();

router.get('/', chatController.getChats);
router.post('/', chatController.createChat);
router.get('/:chatId', chatController.getChat);
router.post('/:chatId/message', chatController.sendMessage);

module.exports = router;
