const db = require("../configs/database");
const mssql = require("mssql");

module.exports.find = async () => {
	try {
		const record = await db.pool.request().query(`
			SELECT Area.id, Area.title, Area.parent_id, Area.level, Area.type_id, Type.title AS type FROM Area
			LEFT JOIN Type ON Area.type_id = Type.id
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
SELECT Area.id, Area.title, Area.parent_id, Area.level, Area.type_id, Type.title AS type FROM Area
			LEFT JOIN Type ON Area.type_id = Type.id
                WHERE Area.id = @id
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
            SELECT * FROM Area
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
            SELECT * FROM Area
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
			.input("parent_id", mssql.Int, data.parent_id)
			.input("level", mssql.Int, data.level)
			.input("type_id", mssql.Int, data.type_id)
			.query(`
                INSERT INTO Area (
					title,
					parent_id,
					level,
					type_id
				)
                VALUES (@title,
                        @parent_id,
                        @level,
                        @type_id
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
			.input("parent_id", mssql.Int, data.parent_id)
			.input("level", mssql.Int, data.level)
			.input("type_id", mssql.Int, data.type_id)
			.query(`
                UPDATE Area
                SET 
                    title = @title,
                    parent_id = @parent_id,
                    level = @level,
                    type_id = @type_id
                WHERE id = @id;
                SELECT
                    *
                FROM Area 
                WHERE id = @id;
            `);
		if (record.recordset.length === 0) {
			return { success: false, message: "Area not found" };
		}
		return {
			success: true,
			message: "Area updated successfully",
			data: record.recordset[0],
		};
	} catch (error) {
		console.error("Error updating Area:", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};

module.exports.count = async () => {
	try {
		const record = await db.pool.request().query(`
            SELECT COUNT(*) AS total FROM Area;
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
                DELETE FROM Area WHERE id = @id;
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
