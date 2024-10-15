const Permission = require("../models/permission.model");

// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const permission = await Permission.find();
        const totalPermission = await Permission.count();
        if (!permission.length) {
            return res
                .json({
                    code: 204,
                    message: "No permission found",
                })
        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalPermission.total,
            permission
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
        const permission = await Permission.findById(id);
        if (permission.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found permission",
                })

        }
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            permission: permission[0],
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
        
        const existedPermission = await Permission.findByData("title", data.title);
        // console.log(data);
        
        // console.log(existedpermission);

        if (existedPermission.length != 0) {
            return res.json({
                code: 500,
                message: "permission already exists",
            });
        }
        const permission = await Permission.create(data);
        const createdPermission = await Permission.findByData("title", data.title);
        if (createdPermission.length == 0) {
            return res.json({
                code: 500,
                message: "Failed to create permission",
            });
        }
        return res.status(201).json({
            code: 201,
            message: "Create data success",
            permission: permission[0],
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
        const existedPermission = await Permission.findById(id);
        console.log(existedPermission );
        if (existedPermission .length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found permission",
                })

        }
        const permission = await Permission.updateById(id, data);
        console.log(Permission);
        if (permission.success)
            {
                return res.status(200).json({
                    code: 200,
                    message: "Update permission success",
                    permission: permission.data
                })
            }
            else {
                return res.json({
                    code: 500,
                    message: "Update permission failed",
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
        const existedPermission = await Permission.findById(id);
        console.log(existedPermission);
        if (existedPermission.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found permission",
                })
        }
        const permission = await Permission.deleteById(id);
        if (permission)
        {
            return res.json({
                code: 200,
                message: "Delete permission success",
            })
        }
        else {
            return res.json({
                code: 500,
                message: "Delete permission failed",
            })
        }
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
