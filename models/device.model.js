const db = require("../configs/database");
const mssql = require("mssql");


module.exports.find = async () => {
	try {
		const record = await db.pool.request().query("SELECT * FROM Device");
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
		const record = await db.pool
			.request()
			.input("id", mssql.Int, id)
			.query("SELECT * FROM Device WHERE id = @id");

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
            SELECT * FROM Device
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
            SELECT * FROM Device
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

module.exports.create = async (device) => {
	try {
		const result = await db.pool
			.request()
			.input("device_id", mssql.NVarChar, device.device_id)
			.input("state", mssql.Int, 0)
			.input("description", mssql.NVarChar, device.description)
			.input("type_id", mssql.Int, device.type_id)
			.input("area_id", mssql.Int, device.area_id)
			.query(
				"INSERT INTO Device (device_id, state, description, type_id, area_id) VALUES (@device_id, @state, @description, @type_id, @area_id)"
			);
		return { success: true, id: result.recordset[0].id };
	} catch (error) {
		console.error("Error creating user:", error.message);
		return { success: false, message: error.message };
	}
};

module.exports.updateById = async (id, device) => {
	try {
		const record = await db.pool
			.request()
			.input("id", mssql.Int, id)
			.input("device_id", mssql.NVarChar, device.device_id)
			.input("state", db.mssql.Int, 0)
			.input("description", mssql.NVarChar, device.description)
			.input("type_id", mssql.Int, device.type_id)
			.input("area_id", mssql.Int, device.area)
			.query(`
                UPDATE Device
                SET 
                    device_id = @device_id,
					state = @state,
					description = @description,
                    type_id = @type_id,
					area_id = @area_id
                WHERE id = @id;
                SELECT
                    *
                FROM Device 
                WHERE id = @id;
            `);
		if (record.recordset.length === 0) {
			return { success: false, message: "Device not found" };
		}
		return {
			success: true,
			message: "Device updated successfully",
			data: record.recordset[0],
		};
	} catch (error) {
		console.error("Error updating Device:", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};

module.exports.count = async () => {
	try {
		const record = await db.pool.request()
		.query(`
            SELECT COUNT(*) AS total FROM Device;
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

module.exports.countById = async (id) => {
	try {
		const record = await db.pool.request()
		.input("id", mssql.Int, id)
		.query(`
			SELECT COUNT(*) AS total FROM DataLog WHERE device_id = @id;
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
                DELETE FROM Device WHERE id = @id;
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

module.exports.deleteById = async (id) => {
	try {
		const record = await db.pool.request().input("id", mssql.Int, id)
			.query(`
                DELETE FROM Device WHERE id = @id;
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

module.exports.getDataLogDevice = async (id) => {
	try {
		const record = await db.pool
			.request()
			.input("id", mssql.Int, id)
			.query(`
				SELECT TOP 10 * FROM DataLog WHERE device_id = @id
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