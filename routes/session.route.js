const express = require('express');
const router = express.Router();
const controller = require('../controllers/session.controller');

router.post('/', controller.createSession);
router.get('/:id', controller.getSession);
router.delete('/delete/:id', controller.deleteSession);
router.post('/expire-all', controller.setAllSessionsExpired);
module.exports = router;
