const Session = require('../models/session.model');

async function checkSession(req, res, next) {
    const session_id = req.body.session_id;

    if (!session_id) {
        return res.status(401).json({
            message: 'Session ID is required'
        });
    }

    try {
        const session = await Session.getSession(session_id);

        if (!session) {
            return res.status(401).json({
                message: 'Invalid session'
            });
        }

        if (session.expired) {
            return res.status(401).json({
                message: 'Session expired'
            });
        }

        req.session = session;
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = checkSession;