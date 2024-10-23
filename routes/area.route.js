const express = require('express');
const router = express.Router();
const controller = require('../controllers/area.controller');

router.post('/', controller.index);
router.post('/detail/:id', controller.detail);
router.post('/create/', controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/delete/:id', controller.delete);
router.post('/get-device/:id', controller.deviceInArea)
router.post('/get-abnormal/:id', controller.logAbnormal)

module.exports = router;