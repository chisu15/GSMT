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
        .input('permission_id', mssql.Int, account.permission_id)
        .query('INSERT INTO Account (username, type, full_name, password, permission_id) VALUES (@username, @type, @full_name, @password, @permission_id)');
    return result.recordset;
}

async function updateAccount(id, account) {
    const updateFields = [];
    if (account.username) updateFields.push(`username = @username`);
    if (account.session_id) updateFields.push(`session_id = @session_id`);
    if (account.type) updateFields.push(`type = @type`);
    if (account.full_name) updateFields.push(`full_name = @full_name`);
    if (account.password) updateFields.push(`password = @password`);
    if (account.permission_id) updateFields.push(`permission_id = @permission_id`);
    const query = `UPDATE Account SET ${updateFields.join(', ')} WHERE id = @id`;

    const request = db.pool.request().input('id', mssql.Int, id);

    if (account.username) request.input('username', mssql.NVarChar, account.username);
    if (account.session_id) request.input('session_id', mssql.NVarChar, account.session_id);
    if (account.type) request.input('type', mssql.NVarChar, account.type);
    if (account.full_name) request.input('full_name', mssql.NVarChar, account.full_name);
    if (account.password) request.input('password', mssql.NVarChar, account.password);
    if (account.permission_id) request.input('permission_id', mssql.Int, account.permission_id);
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