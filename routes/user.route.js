const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/', userController.createUser);
router.get('/:userId/articles', userController.getAllUserArticles);
router.put('/:userId', userController.editUser);
router.get('/:userId', userController.getUser);
router.delete('/:userId', userController.removeUser);


module.exports = router;