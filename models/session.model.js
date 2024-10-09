const db = require('../configs/database');
const mssql = require("mssql");
async function createSession(session) {

    const result = await db.pool.request()
        .input('session_id', mssql.NVarChar, session.session_id)
        .input('account_id', mssql.Int, session.account_id)
        .input('expires_at', mssql.DateTime, session.expires_at)
        .query('INSERT INTO Sessions (session_id, account_id, expires_at) VALUES (@session_id, @account_id, @expires_at)');
    return result.recordset;
}

async function getSession(session_id) {

    const result = await db.pool.request()
        .input('session_id', mssql.NVarChar, session_id)
        .query('SELECT * FROM Sessions WHERE session_id = @session_id');
    return result.recordset[0];
}

async function deleteSession(session_id) {

    const result = await db.pool.request()
        .input('session_id', mssql.NVarChar, session_id)
        .query('DELETE FROM Sessions WHERE session_id = @session_id');
    return result.recordset;
}
async function setSessionExpired(session_id) {

    const result = await db.pool.request()
        .input('session_id', mssql.NVarChar, session_id)
        .query('UPDATE Sessions SET expired = 1 WHERE session_id = @session_id');
    return result.recordset;
}
async function setAllSessionsExpired() {

    const result = await db.pool.request()
        .query('UPDATE Sessions SET expired = 1 WHERE expired = 0');
    return result.recordset;
}

module.exports = {
    createSession,
    getSession,
    deleteSession,
    setSessionExpired,
    setAllSessionsExpired
};