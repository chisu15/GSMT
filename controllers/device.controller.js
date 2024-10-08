const Device = require("../models/device.model");



// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const device = await Device.find();
        const totalDevice = await Device.count();
        if (!device.length) {
            return res
                .json({
                    code: 204,
                    message: "No Device found",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalDevice.total,
            device,
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
        const device = await Device.findById(id);
        if (device.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Device",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            Device: device[0],
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
        const existedDevice = await Device.findByData("device_id", data.device_id);
        console.log(data);
        
        // console.log(data);
        
        // console.log(existedDevice);

        if (existedDevice.length != 0) {
            return res.json({
                code: 500,
                message: "Device already exists",
            });
        }
        const device = await Device.create(data);
        const createdDevice = await Device.findByData("device_id", data.device_id);
        if (createdDevice.length == 0) {
            return res.json({
                code: 500,
                message: "Failed to create Device",
            });
        }
        return res.status(201).json({
            code: 201,
            message: "Create data success",
            Device: device[0],
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
        const existedDevice = await Device.findById(id);
        console.log(existedDevice);
        if (existedDevice.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Device",
                })

        }
        const device = await Device.updateById(id, data);
        console.log(device);
        if (device.success)
            {
                return res.status(200).json({
                    code: 200,
                    message: "Update Device success",
                    Device: device.data
                })
            }
            else {
                return res.json({
                    code: 500,
                    message: "Update Device failed",
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
        const existedDevice = await Device.findById(id);
        console.log(existedDevice);
        if (existedDevice.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Device",
                })

        }
        const device = await Device.deleteById(id);
        if (device)
        {
            return res.json({
                code: 200,
                message: "Delete Device success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete Device failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
