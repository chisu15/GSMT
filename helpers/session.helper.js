const schedule = require('node-schedule');
const sessionModel = require('../models/session.model');

class Scheduler {
    static scheduleSessionExpiration(session_id, expires_at) {
        // Schedule the session expiration
        schedule.scheduleJob(expires_at, async () => {
            await sessionModel.expireSession(session_id);
            console.log(`Session ${session_id} has been marked as expired`);
        });
    }
}

module.exports = Scheduler;
