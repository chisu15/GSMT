const Device = require("../models/device.model");
const calculate = require("../helpers/calculate");
const crypto = require("crypto");
const moment = require("moment-timezone");

// [POST] INDEX
module.exports.index = async (req, res) => {
	try {
		const device = await Device.find();
		const totalDevice = await Device.count();
		if (!device.length) {
			return res.json({
				code: 204,
				message: "No Device found",
			});
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
			return res.json({
				code: 204,
				message: "Not found Device",
			});
		}
		const countById = await Device.countById(id);
		if (countById.total == 0) {
			return res.json({
				code: 204,
				message: "No DataLog found",
			});
		}
		const dataLogDevice = await Device.getDataLogDevice(id);

        const lastActiveTime = await Device.getLastActiveTime(id);
        console.log("Last Active Time (UTC):", calculate.formatDate(lastActiveTime));
        var formattedTime = calculate.formatDate(lastActiveTime)
        formattedTime = moment(formattedTime , "HH:mm DD-MM-YYYY");
        

		return res.status(200).json({
			code: 200,
			message: "Get data success",
			lastActiveTime: formattedTime.fromNow(),
			device: device[0],
			total: countById.total,
			dataLog: dataLogDevice,
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
		const existedDevice = await Device.findByData(
			"device_id",
			data.device_id
		);
		if (existedDevice.length != 0) {
			return res.json({
				code: 500,
				message: "Device already exists",
			});
		}
		const dataCreate = {
			...data,
			state: 1,
		};
		const device = await Device.create(dataCreate);
		const createdDevice = await Device.findByData(
			"device_id",
			data.device_id
		);
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
		const { id } = req.params;
		const data = req.body;
		const existedDevice = await Device.findById(id);
		console.log(existedDevice);
		if (existedDevice.length == 0) {
			return res.json({
				code: 204,
				message: "Not found Device",
			});
		}
		const device = await Device.updateById(id, data);
		console.log(device);
		if (device.success) {
			return res.status(200).json({
				code: 200,
				message: "Update Device success",
				Device: device.data,
			});
		} else {
			return res
				.json({
					code: 500,
					message: "Update Device failed",
				})
				.status(500);
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
			return res.json({
				code: 204,
				message: "Not found Device",
			});
		}
		const device = await Device.deleteById(id);
		if (device) {
			return res.json({
				code: 200,
				message: "Delete Device success",
			});
		} else {
			return res.json({
				code: 500,
				message: "Delete Device failed",
			});
		}
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};

module.exports.disable = async (req, res) => {
	try {
		const { id } = req.params;
		const existedDevice = await Device.findById(id);
		console.log(existedDevice);
		if (existedDevice.length == 0) {
			return res.json({
				code: 204,
				message: "Not found Device",
			});
		}
		if (existedDevice[0].state == 0) {
			return res.json({
				code: 200,
				message: "Device already disable",
			});
		}

		const device = await Device.disable(id, 0);
		const data = device.data;
		const isDisableDevice = await Device.findById(id);
		if (isDisableDevice[0].state == 0) {
			return res.json({
				code: 200,
				message: "Device disable success",
				device: data,
			});
		} else {
			return res.json({
				code: 500,
				message: "Device disable failed",
			});
		}
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};
module.exports.enable = async (req, res) => {
	try {
		const { id } = req.params;
		const existedDevice = await Device.findById(id);
		console.log(existedDevice);
		if (existedDevice.length == 0) {
			return res.json({
				code: 204,
				message: "Not found Device",
			});
		}
		if (existedDevice[0].state == 1) {
			return res.json({
				code: 200,
				message: "Device already enable",
			});
		}

		const device = await Device.disable(id, 1);
		const data = device.data;
		const isDisableDevice = await Device.findById(id);
		if (isDisableDevice[0].state == 1) {
			return res.json({
				code: 200,
				message: "Device enable success",
				device: data,
			});
		} else {
			return res.json({
				code: 500,
				message: "Device enable failed",
			});
		}
	} catch (error) {
		return res.status(500).json({
			code: 500,
			message: error.message,
		});
	}
};
