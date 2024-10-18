const db = require("../configs/database");
const mssql = require("mssql");

// Lấy tất cả ảnh
module.exports.find = async () => {
	try {
		const record = await db.pool.request().query(`
			SELECT * FROM Image
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

// Lấy một ảnh theo ID
module.exports.findById = async (id) => {
	try {
		const record = await db.pool.request().input("id", mssql.Int, id)
			.query(`
            SELECT * FROM Image
            WHERE id = @id
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

// Lấy ảnh theo khóa
module.exports.findByData = async (key, value) => {
	try {
		const query = `
            SELECT * FROM Image
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
module.exports.findByDataInt = async (key, value) => {
	try {
		const query = `
            SELECT * FROM Image
            WHERE ${key} = @value
        `;

		const record = await db.pool
			.request()
			.input("value", mssql.Int, value)
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

// Lấy ảnh theo nhiều khóa
module.exports.findByMultipleData = async (key1, key2, key3, key4, value1, value2, value3, value4) => {
	try {
		const query = `
            SELECT * FROM Image
            WHERE ${key1} = @value1 
            AND ${key2} = @value2 
            AND ${key3} = @value3 
            AND ${key4} = @value4
        `;

		const record = await db.pool
			.request()
			.input("value1", mssql.NVarChar, value1)
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

// Tạo mới một ảnh
module.exports.create = async (data) => {
	try {
		const result = await db.pool
			.request()
			.input("url", mssql.NVarChar, data.url)
			.input("entity_id", mssql.Int, data.entity_id)
			.input("entity_type", mssql.NVarChar, data.entity_type)
			.query(`
                INSERT INTO Image (
                    url,
                    entity_id,
                    entity_type
				)
                VALUES (
                    @url,
                    @entity_id,
                    @entity_type
				);
                SELECT SCOPE_IDENTITY() AS id;
            `);
		return { success: true, id: result.recordset[0].id };
	} catch (error) {
		console.error("Error creating image:", error.message);
		return { success: false, message: error.message };
	}
};

// Cập nhật một ảnh theo ID
module.exports.updateById = async (id, data) => {
	try {
		const record = await db.pool
			.request()
			.input("id", mssql.Int, id)
			.input("url", mssql.NVarChar, data.url)
			.input("entity_id", mssql.Int, data.entity_id)
			.input("entity_type", mssql.NVarChar, data.entity_type)
			.query(`
                UPDATE Image
                SET 
                    url = @url,
                    entity_id = @entity_id,
                    entity_type = @entity_type
                WHERE id = @id;
                SELECT * FROM Image WHERE id = @id;
            `);
		if (record.recordset.length === 0) {
			return { success: false, message: "Image not found" };
		}
		return {
			success: true,
			message: "Image updated successfully",
			data: record.recordset[0],
		};
	} catch (error) {
		console.error("Error updating Image:", error.message);
		return {
			success: false,
			message: error.message,
		};
	}
};

// Đếm số lượng ảnh
module.exports.count = async () => {
	try {
		const record = await db.pool.request().query(`
            SELECT COUNT(*) AS total FROM Image;
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

// Xóa ảnh theo ID
module.exports.deleteById = async (id) => {
	try {
		const record = await db.pool.request().input("id", mssql.Int, id)
			.query(`
                DELETE FROM Image WHERE id = @id;
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
