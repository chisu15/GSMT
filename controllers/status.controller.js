const Status = require("../models/status.model");

// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const status = await Status.find();
        const totalStatus = await Status.count();
        if (!status.length) {
            return res
                .json({
                    code: 204,
                    message: "No Status found",
                })
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalStatus.total,
            status
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
        const status = await Status.findById(id);
        if (status.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Status",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            status: status[0],
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
        
        const existedStatus = await Status.findByData("title", data.title);
        if (existedStatus.length != 0) {
            return res.json({
                code: 500,
                message: "Status already exists",
            });
        }
        const status = await Status.create(data);
        const createdStatus = await Status.findByData("title", data.title);
        if (createdStatus.length == 0) {
            return res.json({
                code: 500,
                message: "Failed to create Status",
            });
        }
        return res.status(201).json({
            code: 201,
            message: "Create data success",
            Status: status[0],
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
        const existedStatus = await Status.findById(id);
        console.log(existedStatus );
        if (existedStatus .length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Status",
                })

        }
        const status = await Status.updateById(id, data);
        console.log(status);
        if (status.success)
            {
                return res.status(200).json({
                    code: 200,
                    message: "Update Status success",
                    Status: status.data
                })
            }
            else {
                return res.json({
                    code: 500,
                    message: "Update Status failed",
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
        const existedStatus = await Status.findById(id);
        console.log(existedStatus);
        if (existedStatus.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Status",
                })
        }
        const status = await Status.deleteById(id);
        if (status)
        {
            return res.json({
                code: 200,
                message: "Delete Status success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete Status failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
