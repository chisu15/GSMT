const Area = require("../models/area.model");
const crypto = require('crypto');
const {genQRBase64} = require('../helpers/qrHelper');

function buildTree(flatData) {
    let tree = [];
    let lookup = {};
    flatData.forEach(item => {
        lookup[item.id] = { ...item, children: [] };
        console.log( lookup[item.id] )
    });

    // Xây dựng cây dựa vào parent_id
    flatData.forEach(item => {
        if (item.parent_id === 0) {
            tree.push(lookup[item.id]);
            console.log("Check parent 0")
        } else {
            lookup[item.parent_id].children.push(lookup[item.id]);
            console.log("Check chill 1",   lookup[item.parent_id] )
        }
    });

    return tree;
}

// [POST] INDEX
module.exports.index = async (req, res) => {
    try {
        const areas = await Area.find();
        const totalArea = await Area.count();
        if (!areas.length) {
            return res
                .json({
                    code: 204,
                    message: "No area found",
                })

        }
        const areasWithQR = await Promise.all(areas.map(async (area) => {
            const qrCode = await genQRBase64(area.code);
            return {
                ...area,
                qr_code: qrCode
            };
        }));
        const tree = buildTree(areasWithQR)
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            total: totalArea.total,
            area: areasWithQR, 
            tree,
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
        const urlQR = process.env.URL_FE + area[0].code
        console.log(urlQR);
        
        const data = {
            ...area[0],
            url: urlQR,
            qr_code: await genQRBase64(urlQR)
        }
        
        return res.status(200).json({
            code: 200,
            message: "Get data success",
            Area: data,
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
        const existedArea = await Area.findByData("label", data.label);
        // console.log(data);
        if(!data.code){
            data.code = "GSMT" + crypto.randomInt(10000000, 100000000).toString();
        }
        // console.log(existedArea);

        if (existedArea.length != 0) {
            return res.json({
                code: 500,
                message: "Area already exists",
            });
        }
        const area = await Area.create(data);
        const createdArea = await Area.findByData("label", data.label);
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
        if((existedArea[0].code == null) || !data.code)
        {
            data.code = "GSMT" + crypto.randomInt(10000000, 100000000).toString();
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


module.exports.deviceInArea = async (req, res) => {
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
        const devices = await Area.getDevice(id);
        if (devices.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found Device on this Area",
                })

        }
        return res.status(200)
        .json({
            code: 200,
            message: "Get Device on Area success!",
            devices
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};

module.exports.logAbnormal = async (req, res) => {
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
        const abnormalLog = await Area.getAbnormalLog(id);
        if (abnormalLog.length == 0) {
            return res
                .json({
                    code: 204,
                    message: "Not found abnormal log on this Area",
                })

        }
        return res.status(200)
        .json({
            code: 200,
            message: "Get abnormal log on Area success!",
            abnormalLog
        })
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: error.message,
        });
    }
};
