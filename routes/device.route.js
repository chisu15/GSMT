const express = require('express');
const router = express.Router();
const controller = require('../controllers/device.controller');
const MQTT = require('../configs/mqtt')

router.post('/', controller.index);
router.post('/detail/:id', controller.detail);
router.post('/create/', controller.create);
router.patch('/edit/:id', controller.edit);
router.delete('/delete/:id', controller.delete);
router.post('/control-light-device', MQTT.controlLightDevice);

module.exports = router;