const mssql = require("mssql");

require("dotenv").config();
const config = {
    user: process.env.MSSQL_USERNAME,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true, 
    },
    pool: {
        max: 10, 
        min: 0, 
        idleTimeoutMillis: 30000, 
    },
};

// Tạo pool kết nối
const pool = new mssql.ConnectionPool(config)

module.exports = {
    mssql,
    pool,
};

// Hàm kết nối đến cơ sở dữ liệu
module.exports.connect = async () => {
    try {
        await pool.connect();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.log("Database connection error:", error);
    }
};
