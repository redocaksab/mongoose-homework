module.exports = { createArticle, editArticle, getArticle, removeArticle };

const Article = require("../models/article");
const User = require("../models/user");
const _ = require('lodash');
const createError = require("http-errors")

async function createArticle(req, res, next) {
  try {
    const userId = await User.findOne({ _id: req.body.owner });
    if (!userId) {
      next(createError(500, "User not found"));
    }
    const fields = [
      "title",
      "subtitle",
      "description",
      "owner",
      "category",
    ];

    const payload = _.pick(req.body, fields);

    const article = new Article(payload);
    const newArticle = await article.save();

    userId.articles.push(article._id);
    userId.numberOfArticles++;

    await userId.save();

    return res.json(newArticle);
  } catch (err) {
    console.log(err);
    next(createError(500, err));
  }
}

async function editArticle(req, res, next) {

  try {
    const articleId = req.params.articleId;
    const payload = req.body;
    payload['updatedAt'] = new Date();
    const article = await Article.findByIdAndUpdate(articleId, payload);
    if (!article) {
      throw new Error("article not found!")
    }
    article.updatedAt = new Date()
    return res.status(200).json(article);
  } catch (err) {
    console.log(err);
    next(createError(500, err));
  }
}


async function getArticle(req, res, next) {
  try {
    const filters = req.query;
    const articles = await Article.find(filters).populate('owner', 'firstName lastName');
    if (!articles.length) {
      throw new Error("filter is wrong!")
    }
    return res.status(200).json(articles);
  } catch (err) {
    console.log(err);
    next(createError(500, err));
  }
}

async function removeArticle(req, res, next) {
  try {
    const articleId = req.params.articleId;
    const targetArticle = await Article.findOne({_id: articleId});
    const targetUser = await User.findOne({_id: targetArticle.owner});
    targetUser.numberOfArticles-=1;
    targetUser.articles.remove(articleId)
    await targetUser.save();
    await Article.findByIdAndRemove(articleId);
    return res.status(200).json({ delete: 'Article was deleted' })
  }
  catch (err) {
    console.log(err);
    next(createError(500, err));
  }
}
