module.exports = { createUser, editUser, getUser, removeUser, getAllUserArticles };

const User = require("../models/user");
const Article = require("../models/article");
const _ = require('lodash');
const createError = require("http-errors")

async function createUser(req, res, next) {
  try {
    const existingUser = await User.findOne({firstName: req.body.firstName, lastName: req.body.lastName});
    if (existingUser) {
     throw new Error("user already exists!");
    }
    const fields = [
      "firstName",
      "lastName",
      "role",
      "createdAt",
      "numberOfArticles",
      "articles",
      "nickname",
    ];

    const payload = _.pick(req.body, fields);

    const user = new User(payload);
    const newUser = await user.save();
  

    return res.json(newUser);
  } catch (err) {
    console.log(err);
    next(createError(500, err));
  }
}

async function editUser(req, res, next) {
  try {
    const userId = req.params.userId;
   
    const payload = req.body;
    const result = await User.findByIdAndUpdate(userId, payload);
    if (!result) throw new Error("user not found!");
    return res.status(200).json(result)
  }
  catch (err) {
    console.log(err);
    next(createError(500, err));
  }
}

async function getUser(req, res, next) {
  try {
    const userId = req.params.userId;
    
    if (!userId) next(createError(500, err));

    const result = await User.findById(userId);
    return res.status(200).json(result)
  }
  catch (err) {
    console.log(err);
    next(createError(500, "User not found"));
  }
}

async function removeUser(req, res, next) {
  try {
      const userId = req.params.userId;
      const user = User.findById(userId)
      await Article.deleteMany({owner : userId});
      await User.deleteOne({_id:userId});


      return res.status(200).json({ delete: 'User was deleted' })
  }
  catch (err) {
    console.log(err);
    next(createError(500, "User not found"));
  }
}


async function getAllUserArticles(req,res,next){
  try{
    const userId = req.params.userId;

    const user = await User.findById(userId).populate('articles', 'title subtitle category createdAt updatedAt');
    if (!user) {
        throw new Error('User doesnt exist!')
    }
 
    return res.status(200).json(user);
  }
  catch(e){
    next(e);
  }
}
