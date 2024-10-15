const Account = require('../models/account.model');
const Session = require("../models/session.model");
const bcrypt = require("bcrypt");
const {
    v4: uuidv4
} = require('uuid');
const Scheduler = require("../helpers/session.helper");

async function profile(req, res) {
    try {
        const accounts = await Account.getUserByUsername(req.params.username);
        res.json({
            data: accounts
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function login(req, res) {
    try {
        const {
            username,
            password
        } = req.body;
        console.log(req.body);
        const user = await Account.getUserByUsername(username);
        if (user && bcrypt.compareSync(password, user.password)) {
            const session_id = uuidv4();
            const expires_at = new Date(Date.now() + 30 * 60 * 1000); // Session expires in 30 minutes
            
            await Session.createSession({
                session_id,
                account_id: user.id,
                expires_at
            });

            // Schedule the session expiration
            Scheduler.scheduleSessionExpiration(session_id, expires_at);
            var data = {...user, session_id, expires_at}
            res.json({
                code: 200,
                message: 'Login successful',
                data: data
            });
        } else {
            res.status(401).json({
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function logout(req, res) {
    const {
        session_id
    } = req.body;
    try {
        await Session.setSessionExpired(session_id);
        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function getAllAccounts(req, res) {
    try {
        const accounts = await Account.getAllAccounts();
        res.json({
            code: 200,
            data: accounts
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function createAccount(req, res) {
    try {
        const account = req.body;
        account.password = bcrypt.hashSync(account.password, 10);
        await Account.createAccount(account);
        res.status(201).json({
            message: 'Account created successfully'
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function updateAccount(req, res) {
    try {
        const {id} = req.params;
        const account = req.body;
        if (account.password) {
            account.password = bcrypt.hashSync(account.password, 10);
        }
        await Account.updateAccount(id, account);
        res.status(200).json({
            message: 'Account updated successfully'
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function deleteAccount(req, res) {
    try {
        const username = req.params.username;
        await Account.deleteAccount(username);
        res.status(200).json({
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    login,
    profile,
    logout,
    getAllAccounts,
    updateAccount,
    createAccount,
    deleteAccount
};