const DataLog = require("../models/datalog.model");
const Device = require("../models/device.model");




// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const dataLog = await DataLog.find();
        const totalDataLog = await DataLog.count();
        if (!dataLog.length) {
            return res
                .json({
                    code: 204,
                    message: "No DataLog found",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalDataLog.total,
            dataLog,
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};

// [POST] DETAIL
module.exports.detail = async (req, res) => {
    try {
        const { id } = req.params;
        const dataLog = await DataLog.findById(id);
        if (dataLog.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found DataLog",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            DataLog: dataLog[0],
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};

// [POST] CREATE
module.exports.create = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const idDevice = Device.findByData("device_id", data.device_id)
        if (existedDataLog.length != 0) {
            return res.json({
                code: 500,
                message: "DataLog already exists",
            });
        }
        const dataCreate = {
            ...data,
            device_id: idDevice
        }
        const dataLog = await DataLog.create(dataCreate);
        const createdDataLog = await DataLog.findByData("DataLog_id", data.DataLog_id);
        if (createdDataLog.length == 0) {
            return res.json({
                code: 500,
                message: "Failed to create DataLog",
            });
        }
        return res.status(201).json({
            code: 201,
            message: "Create data success",
            DataLog: dataLog[0],
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};

// [PATCH] EDIT
module.exports.edit = async (req, res) => {
    try {
        const {id} = req.params;
        const data = req.body;
        const existedDataLog = await DataLog.findById(id);
        console.log(existedDataLog);
        if (existedDataLog.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found DataLog",
                })

        }
        const dataLog = await DataLog.updateById(id, data);
        console.log(dataLog);
        if (dataLog.success)
            {
                return res.status(200).json({
                    code: 200,
                    message: "Update DataLog success",
                    DataLog: dataLog.data
                })
            }
            else {
                return res.json({
                    code: 500,
                    message: "Update DataLog failed",
                }).status(500)
            }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};

// [DELETE] DELETE
module.exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const existedDataLog = await DataLog.findById(id);
        console.log(existedDataLog);
        if (existedDataLog.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found DataLog",
                })

        }
        const dataLog = await DataLog.deleteById(id);
        if (dataLog)
        {
            return res.json({
                code: 200,
                message: "Delete DataLog success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete DataLog failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};