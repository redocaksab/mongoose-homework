const express = require('express');
const router = express.Router();

const articleController = require('../controllers/article');


router.post('/', articleController.createArticle);
router.put('/:articleId', articleController.editArticle);
router.get('/', articleController.getArticle);
router.delete('/:articleId', articleController.removeArticle);



module.exports = router;