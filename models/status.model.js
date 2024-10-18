const db = require("../configs/database");
const mssql = require("mssql");

module.exports.find = async () => {
	try {
		const record = await db.pool.request().query(`
			SELECT * FROM Status
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

module.exports.findById = async (id) => {
	try {
		const record = await db.pool.request().input("id", mssql.Int, id)
			.query(`
            SELECT *  FROM Status
                WHERE Status.id = @id
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
            SELECT * FROM Status
            WHERE ${key} = @value
        `;

		const record = await db.pool
			.request()
			.input("value", mssql.NVarChar, value)
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

module.exports.findByMultipleData = async (
	key1,
	key2,
	key3,
	key4,
	value1,
	value2,
	value3,
	value4
) => {
	try {
		const query = `
            SELECT * FROM Status
            WHERE ${key1} = @value1 
            AND ${key2} = @value2 
            AND ${key3} = @value3 
            AND ${key4} = @value4
        `;

		const record = await db.pool
			.request()
			.input("value1", mssql.DateTime2, value1)
			.input("value2", mssql.NVarChar, value2)
			.input("value3", mssql.NVarChar, value3)
			.input("value4", mssql.NVarChar, value4)
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
		const result = await db.pool
			.request()
			.input("title", mssql.NVarChar, data.title)
			.input("description", mssql.NVarChar, data.description)
            .query(`
                INSERT INTO Status (
                    title,
                    description
				)
                VALUES (@title,
                        @description
						);
                SELECT SCOPE_IDENTITY() AS id;
            `);
		return { success: true, id: result.recordset[0].id };
	} catch (error) {
		console.error("Error creating user:", error.message);
		return { success: false, message: error.message };
	}
};

module.exports.updateById = async (id, data) => {
	try {
		const record = await db.pool
			.request()
			.input("id", mssql.Int, id)
			.input("title", mssql.NVarChar, data.title)
			.input("description", mssql.Int, data.description)
            .query(`
                UPDATE Status
                SET 
                    title = @title,
                    description = @description
                WHERE id = @id;
                SELECT
                    *
                FROM Status 
                WHERE id = @id;
            `);
		if (record.recordset.length === 0) {
			return { success: false, message: "Status not found" };
		}
		return {
			success: true,
			message: "Status updated successfully",
			data: record.recordset[0],
		};
	} catch (error) {
		console.error("Error updating Status:", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};

module.exports.count = async () => {
	try {
		const record = await db.pool.request().query(`
            SELECT COUNT(*) AS total FROM Status;
        `);

		return {
			success: true,
			total: record.recordset[0].total,
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
		const record = await db.pool.request().input("id", mssql.Int, id)
			.query(`
                DELETE FROM Status WHERE id = @id;
            `);

		return {
			success: true,
			message: "Record deleted successfully",
		};
	} catch (error) {
		console.error("error", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};
