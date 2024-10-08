const db = require('../configs/database');
const mssql = require("mssql");

async function getUserByUsername(username) {
    const result = await db.pool.request()
        .input('username', mssql.NVarChar, username)
        .query('SELECT * FROM Account WHERE username = @username');
    return result.recordset[0];
}

async function getAllAccounts() {
    const result = await db.pool.request().query('SELECT * FROM Account');
    return result.recordset;
}

async function createAccount(account) {
    const result = await db.pool.request()
        .input('username', mssql.NVarChar, account.username)
        .input('type', mssql.NVarChar, account.type)
        .input('full_name', mssql.NVarChar, account.full_name)
        .input('password', mssql.NVarChar, account.password)
        .query('INSERT INTO Account (username, type, full_name, password) VALUES (@username, @type, @full_name, @password)');
    return result.recordset;
}

async function updateAccount(username, account) {
    const updateFields = [];
    if (account.session_id) updateFields.push(`session_id = @session_id`);
    if (account.type) updateFields.push(`type = @type`);
    if (account.full_name) updateFields.push(`full_name = @full_name`);
    if (account.password) updateFields.push(`password = @password`);

    const query = `UPDATE Account SET ${updateFields.join(', ')} WHERE user_name = @username`;

    const request = db.pool.request().input('username', mssql.NVarChar, username);
    if (account.session_id) request.input('session_id', mssql.NVarChar, account.session_id);
    if (account.type) request.input('type', mssql.NVarChar, account.type);
    if (account.full_name) request.input('full_name', mssql.NVarChar, account.full_name);
    if (account.password) request.input('password', mssql.NVarChar, account.password);

    const result = await request.query(query);
    return result.recordset;
}

async function deleteAccount(username) {
    const result = await db.pool.request()
        .input('username', mssql.NVarChar, username)
        .query('DELETE FROM Account WHERE username = @username');
    return result.recordset;
}

module.exports = {
    getUserByUsername,
    getAllAccounts,
    updateAccount,
    createAccount,
    deleteAccount
};