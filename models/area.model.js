const db = require("../configs/database");
const mssql = require("mssql");

module.exports.find = async () => {
	try {
		const record = await db.pool.request().query(`
			SELECT Area.id, Area.label, Area.parent_id, Area.level, Area.type_id, Area.code, Type.title AS type FROM Area
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
SELECT Area.*, Type.title AS type FROM Area
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
			.input("label", mssql.NVarChar, data.label)
			.input("parent_id", mssql.Int, data.parent_id)
			.input("level", mssql.Int, data.level)
			.input("type_id", mssql.Int, data.type_id)
			.input("code", mssql.NVarChar, data.code)
			.query(`
                INSERT INTO Area (
					label,
					parent_id,
					level,
					type_id,
					code
				)
                VALUES (@label,
                        @parent_id,
                        @level,
                        @type_id,
						@code
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
			.input("label", mssql.NVarChar, data.label)
			.input("parent_id", mssql.Int, data.parent_id)
			.input("level", mssql.Int, data.level)
			.input("type_id", mssql.Int, data.type_id)
			.input("code", mssql.NVarChar, data.code)
			.query(`
                UPDATE Area
                SET 
                    label = @label,
                    parent_id = @parent_id,
                    level = @level,
                    type_id = @type_id,
					code = @code
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

module.exports.getDevice = async (area_id) => {
	try {
		const record = await db.pool.request().input("area_id", mssql.Int, area_id) // Thêm area_id vào câu lệnh truy vấn
			.query(`
                SELECT d.*
                FROM Device d
                WHERE d.area_id = @area_id
            `);

		return record.recordset; // Trả về danh sách các thiết bị theo area_id
	} catch (error) {
		console.error("SQL error", error);
		throw new Error("Could not retrieve devices by area_id");
	}
};
