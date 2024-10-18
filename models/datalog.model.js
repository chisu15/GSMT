const db = require("../configs/database");
const mssql = require("mssql");
const calculate = require("../helpers/calculate")

module.exports.find = async () => {
	try {
		const record = await db.pool.request().query(`
			SELECT DataLog.*, Device.device_id AS device FROM DataLog LEFT JOIN Device ON DataLog.device_id = Device.id
			ORDER BY create_at DESC`);
		const dataList = record.recordset
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
			.query("SELECT * FROM DataLog WHERE id = @id");

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
            SELECT * FROM DataLog
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
            SELECT * FROM DataLog
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
		console.log(data);
		const deviceRecord = await db.pool
			.request()
			.input("device_id", mssql.Int, data.device_id)
			.query("SELECT state FROM Device WHERE id = @device_id");

		if (deviceRecord.recordset.length === 0) {
			return { success: false, message: "Device not found" };
		}

		const deviceState = deviceRecord.recordset[0].state;
		if (deviceState === 0) {
			return { success: false, message: "Device is disabled, log not saved" };
		}
		const result = await db.pool
			.request()
			.input("hum", mssql.Float, data.hum)
			.input("temp", mssql.Float, data.temp)
			.input("air_quality", mssql.Float, data.air_quality)
			.input("light", mssql.Float, data.light)
			.input("state", mssql.Int, 0)
			.input("description", mssql.NVarChar, data.description)
			.input("device_id", mssql.Int, data.device_id)
			.query(
				"INSERT INTO DataLog (hum, temp, air_quality, light, state, description, device_id) VALUES ( @hum, @temp, @air_quality, @light, @state, @description, @device_id)"
			);
		return { success: true, id: result.recordset };
	} catch (error) {
		console.error("Error creating user:", error.message, error);
		return { success: false, message: error.message };
	}
};

module.exports.updateById = async (id, data) => {
	try {
		const record = await db.pool
			.request()
			.input("id", mssql.Int, id)
			.input("hum", mssql.Float, data.hum)
			.input("temp", mssql.Float, data.temp)
			.input("air_quality", mssql.Float, data.air_quality)
			.input("light", mssql.Float, data.light)
			.input("state", db.mssql.Int, 0)
			.input("description", mssql.NVarChar, data.description)
			.input("device_id", mssql.Int, data.device_id)
			.query(`
                UPDATE DataLog
                SET 
                    hum = @hum,
                    temp = @temp,
					air_quality = @air_quality,
					light = @light,
					state = @state,
					description = @description,
                    device_id = @device_id
                WHERE id = @id;
                SELECT
                    *
                FROM DataLog 
                WHERE id = @id;
            `);
		if (record.recordset.length === 0) {
			return { success: false, message: "DataLog not found" };
		}
		return {
			success: true,
			message: "DataLog updated successfully",
			data: record.recordset[0],
		};
	} catch (error) {
		console.error("Error updating DataLog:", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};

module.exports.count = async () => {
	try {
		const record = await db.pool.request().query(`
            SELECT COUNT(*) AS total FROM DataLog;
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
                DELETE FROM DataLog WHERE id = @id;
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
