const Area = require("../models/area.model");

// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const area = await Area.find();
        const totalArea = await Area.count();
        if (!area.length) {
            return res
                .json({
                    code: 204,
                    message: "No area found",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalArea.total,
            area,
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
        const area = await Area.findById(id);
        if (area.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Area",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            Area: area[0],
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
        const existedArea = await Area.findByData("title", data.title);
        // console.log(data);
        
        // console.log(existedArea);

        if (existedArea.length != 0) {
            return res.json({
                code: 500,
                message: "Area already exists",
            });
        }
        const area = await Area.create(data);
        const createdArea = await Area.findByData("title", data.title);
        if (createdArea.length == 0) {
            return res.json({
                code: 500,
                message: "Failed to create area",
            });
        }
        return res.status(201).json({
            code: 201,
            message: "Create data success",
            Area: area[0],
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
        const existedArea = await Area.findById(id);
        console.log(existedArea);
        if (existedArea.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found area",
                })

        }
        const area = await Area.updateById(id, data);
        console.log(Area);
        if (area.success)
            {
                return res.status(200).json({
                    code: 200,
                    message: "Update area success",
                    Area: area.data
                })
            }
            else {
                return res.json({
                    code: 500,
                    message: "Update area failed",
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
        const existedArea = await Area.findById(id);
        console.log(existedArea);
        if (existedArea.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found area",
                })

        }
        const area = await Area.deleteById(id);
        if (area)
        {
            return res.json({
                code: 200,
                message: "Delete area success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete area failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
