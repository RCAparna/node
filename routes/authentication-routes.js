const express = require('express');
const { body } = require('express-validator/check');

//app imports
const authController = require('../controllers/authentication-controller');
const User = require('../models/user');
const SERVER_MESSAGES = require('../constants/server.constants')


const authRouter = express.Router();
authRouter.put(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage(SERVER_MESSAGES.INVALID_EMAIL)
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(SERVER_MESSAGES.DUPLICATE_EMAIL);
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 }),
    body('username')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.register
);

authRouter.post('/login', authController.login);

module.exports = authRouter;
