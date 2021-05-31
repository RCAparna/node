const { validationResult } = require('express-validator/check');
const SERVER_MESSAGES = require('../constants/server.constants');

const Dashboard = require('../models/dashboard');
const User = require('../models/user');


exports.createYourDashboard = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(SERVER_MESSAGES.VALIDATION_FAILED);
        error.statusCode = 422;
        throw error;
    }
    const description = req.body.description;
    const amount = req.body.amount;
    const teammember = req.body.teammember;
    const role = req.body.role;
    const dashboard = new Dashboard({
        description: description,
        amount: amount,
        teammember: teammember,
        role: role,
        creator: req.userId
    });
    try {
        await dashboard.save();
        const user = await User.findById(req.userId);
        user.transactions.push(dashboard);
        const savedUser = await user.save();
        res.status(201).json({
            message: SERVER_MESSAGES.DASHBOARD_CREATE_SUCCESS,
            dashboard: dashboard
        });
        return savedUser;
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.retreiveUserDashBoardDetails = async (req, res, next) => {
    const userId = req.query.userId;
    const dashboard = await Dashboard.find({ creator: userId });
    const user = await User.findById(userId);
    try {
        if (!dashboard) {
            const error = new Error(SERVER_MESSAGES.DASHBOARD_LOAD_ERROR);
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: SERVER_MESSAGES.DASHBOARD_LOAD_SUCCESS, dashboard: dashboard, user: { username: user.username, _id: user._id, lastlogin: user.updatedAt } });
        return;
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
};

