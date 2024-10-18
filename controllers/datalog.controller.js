const DataLog = require("../models/datalog.model");
const Device = require("../models/device.model");
const calculate = require("../helpers/calculate")

function formatDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var miliseconds = date.getMilliseconds();
	var months = date.getMonth() + 1;
	var day = date.getDate();
	//var ampm = hours >= 12 ? 'pm' : 'am';
	// hours = hours % 24;
	// hours = hours ? hours : 24; // the hour '0' should be '12'
	day = day < 10 ? "0" + day : day;
	months = months < 10 ? "0" + months : months;
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	var strTime = hours + ":" + minutes;
	return strTime + " " + day + "-" + months + "-" + date.getFullYear();
  }


// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const dataLog = await DataLog.find(); // Fetch all data logs
        const totalDataLog = await DataLog.count(); // Get total count

        // Check if there are no records found
        if (!dataLog.length) {
            return res.status(204).json({
                code: 204,
                message: "No DataLog found",
            });
        }

        // Format the data
        const formatDataList = dataLog.map(data => {
            // Ensure data.create_at exists, if not assign N/A
            const formattedDate = data.create_at ? formatDate(new Date(data.create_at)) : "N/A";
            
            return {
                id: data.device_id,
                device: data.device,
                temp: data.temp,
                hum: data.hum,
                light: data.light,
                air_quality: data.air_quality,
                create_at: formattedDate,
            };
        });

        // Return success response
            return res
                .json({
                    code: 204,
                    message: "No DataLog found",
                })

        }
        
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalDataLog, // Return total count
            data: formatDataList,
        });
    } catch (error) {
        // Handle any error and return a 500 status
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
