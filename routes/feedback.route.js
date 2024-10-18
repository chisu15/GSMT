const express = require('express');
const router = express.Router();
const controller = require('../controllers/feedback.controller');
const uploadMiddleware = require('../middlewares/upload.middleware');

router.post('/', controller.index);
router.post('/detail/:id', controller.detail);
router.post('/create/', uploadMiddleware, controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/delete/:id', controller.delete);

module.exports = router;