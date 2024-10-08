const express = require('express');
const router = express.Router();
const controller = require('../controllers/type.controller');

router.post('/', controller.index);
router.post('/detail/:id', controller.detail);
router.post('/create/', controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/delete/:id', controller.delete);

module.exports = router;