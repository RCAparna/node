const jwt = require('jsonwebtoken');
//app imports
const SERVER_MESSAGES = require('../constants/server.constants')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    errorFunc(SERVER_MESSAGES.NOT_AUTHENTICATED)
  
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'aparnaSecretTokenForNodeApp');
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    errorFunc(SERVER_MESSAGES.NOT_AUTHENTICATED)
   
  }
  req.userId = decodedToken.userId;
  next();
};

function errorFunc(msg) {
  const error = new Error(msg);
  error.statusCode = 401;
  throw error;
}
