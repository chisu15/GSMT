const Session = require('../models/session.model');
const { v4: uuidv4 } = require('uuid');
const Scheduler = require('../helpers/session.helper');

async function createSession(req, res) {
    const { account_id } = req.body;
    const session_id = uuidv4();
    const expires_at = new Date(Date.now() + 30 * 60 * 1000); // Session expires in 30 minutes

    try {
        await Session.createSession({ session_id, account_id, expires_at });
        Scheduler.scheduleSessionExpiration(session_id, expires_at);
        res.status(201).json({ session_id, expires_at });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function getSession(req, res) {
    const { session_id } = req.params;

    try {
        const session = await Session.getSession(session_id);
        if (session) {
            res.json(session);
        } else {
            res.status(404).json({ message: 'Session not found' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function deleteSession(req, res) {
    const { session_id } = req.params;

    try {
        await Session.deleteSession(session_id);
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function setAllSessionsExpired(req, res) {
    try {
        await Session.setAllSessionsExpired();
        res.status(200).json({ message: 'All sessions expired successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    createSession,
    getSession,
    deleteSession,
    setAllSessionsExpired
};
