const express = require('express');
const router = express.Router();
const controller = require('../controllers/account.controller');


router.post('/login', controller.login);
router.post("/logout", controller.logout)
router.get('/', controller.getAllAccounts);
router.get('/profile/:username', controller.profile)
router.post('/create-account', controller.createAccount);
router.patch('/edit/:username', controller.updateAccount);
router.delete('/:username', controller.deleteAccount);
module.exports = router;
