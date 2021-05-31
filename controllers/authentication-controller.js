const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//app imports
const User = require('../models/user');
const SERVER_MESSAGES = require('../constants/server.constants')

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(SERVER_MESSAGES.VALIDATION_FAILED);
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPw,
      username: username
    });
    const result = await user.save();
    res.status(201).json({ message: SERVER_MESSAGES.USER_CREATED, userId: result._id });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

exports.login = async (req, res, next) => {
  const errFunc = (msg)=>{
    const error = new Error(msg);
    error.statusCode = 401;
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      errFunc(SERVER_MESSAGES.USER_NOT_FOUND)
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      errFunc(SERVER_MESSAGES.WRONG_PWD)
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      },
      'aparnaSecretTokenForNodeApp',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};




