const db = require("../configs/database");
const mssql = require("mssql");

module.exports.findAll = async () => {
    try {
        const record = await db.pool.request().query(`SELECT * FROM Type`);
        return record.recordset;
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.findById = async (id) => {
    try {
        const record = await db.pool.request()
            .input('id', mssql.Int, id)
            .query(`
                SELECT * description FROM Type WHERE id = @id
            `);
        
        return record.recordset;
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};


module.exports.findByData = async (key, value) => {
    try {      
        const query = `
            SELECT * FROM Type
            WHERE ${key} = @value
        `;

        const record = await db.pool.request()
            .input('value', mssql.NVarChar, value)
            .query(query);

        return record.recordset;
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};


module.exports.create = async (data) => {
    try {
        console.log(data);
        
        const record = await db.pool.request()
            .input('title', mssql.NVarChar, data.title)
            .input('description', mssql.NVarChar, data.description)
            .query(`
                INSERT INTO Type (title, description)
                VALUES (@title, @description);
                SELECT SCOPE_IDENTITY() AS id;
            `);

        return {
            success: true,
            id: record.recordset[0].id,
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.updateById = async (id, data) => {
    try {
        const record = await db.pool.request()
            .input('id', mssql.Int, id)
            .input('title', mssql.NVarChar, data.title)
            .input('description', mssql.NVarChar, data.description)
            .query(`
                UPDATE Type
                SET title = @title, description = @description
                WHERE id = @id;
                SELECT id, title, description FROM Type WHERE id = @id
            `);
        return {
            success: true,
            message: 'Record updated successfully',
            data: record.recordset[0],
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.deleteById = async (id) => {
    try {
        const record = await db.pool.request()
            .input('id', mssql.Int, id)
            .query(`
                DELETE FROM Type WHERE id = @id;
            `);
        
        return {
            success: true,
            message: 'Record deleted successfully'
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

module.exports.count = async () => {
    try {
        const record = await db.pool.request().query(`
            SELECT COUNT(*) AS total FROM Type;
        `);
        
        return {
            success: true,
            total: record.recordset[0].total
        };
    } catch (error) {
        console.error("error", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};
