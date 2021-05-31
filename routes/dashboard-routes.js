const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();

//app imports
const dashBoardController = require('../controllers/dashboard-controller');
const isAuthenticated = require('../authentication-middleware/isAuthenticated');

router.post(
  '/createYourDashboard',
  isAuthenticated,
  [
    body('description')
      .isLength({ min: 100, max: 100 })
      .trim(),
    body('amount')
      .trim(),
    body('teammember')
      .trim(),
    body('role')
      .trim()
  ],
  dashBoardController.createYourDashboard
);
router.get('/retreiveUserDashBoardDetails',
isAuthenticated, 
  dashBoardController.retreiveUserDashBoardDetails);


module.exports = router;
