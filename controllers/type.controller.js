const Type = require("../models/type.model");

// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const type = await Type.findAll();
        const totalType = await Type.count();
        if (!type.length) {
            return res
                .json({
                    code: 204,
                    message: "No type found",
                })
                .status(204);
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalType.total,
            type,
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
        const type = await Type.findById(id);
        if (type.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found type",
                })
                .status(204);
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            type: type[0],
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
        const existedType = await Type.findByData("title", data.title);
        // console.log(data);
        
        // console.log(existedType);

        if (existedType.length != 0) {
            return res.json({
                code: 500,
                message: "type already exists",
            });
        }
        const type = await Type.create(data);
        const createdType = await Type.findByData("title", data.title);
        if (createdType.length == 0) {
            return res.json({
                code: 500,
                message: "Failed to create type",
            });
        }
        return res.status(201).json({
            code: 201,
            message: "Create data success",
            type: type[0],
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
        const existedType = await Type.findById(id);
        console.log(existedType);
        if (existedType.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found type",
                })
                .status(204);
        }
        const type = await Type.updateById(id, data);
        console.log(type);
        if (type.success)
            {
                return res.json({
                    code: 200,
                    message: "Update type success",
                    type: type.data
                }).status(200)
            }
            else {
                return res.json({
                    code: 500,
                    message: "Update type failed",
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
        const existedType = await Type.findById(id);
        console.log(existedType);
        if (existedType.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found type",
                })
                .status(204);
        }
        const type = await Type.deleteById(id);
        if (type)
        {
            return res.json({
                code: 200,
                message: "Delete type success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete type failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
