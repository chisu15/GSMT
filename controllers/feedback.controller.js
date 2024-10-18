const Feedback = require("../models/feedback.model");
const Area = require("../models/area.model");
const Image= require("../models/image.model");
const Status= require("../models/status.model");
// [POST] INDEX
module.exports.index = async (req, res) => {
	try {
		const feedback = await Feedback.find();
		const totalFeedback = await Feedback.count();

		if (!feedback.length) {
			return res.json({
				code: 204,
				message: "No Feedback found",
			});
		}
		const baseURL = `${req.protocol}://${req.get('host')}`;
		for (const fb of feedback) {
			fb.images = [];
			const images = await Image.findByDataInt('entity_id', fb.id);
            console.log(images);
            
			if (Array.isArray(images)) {
				fb.images = images.map(img => ({
					...img,
					url: `${baseURL}${img.url}`
				}));
			}

			const status = await Status.findById(fb.status_id);
			fb.status = status.length ? status[0].title : null;
		}

		return res.status(200).json({
			code: 200,
			message: "Get data success",
			total: totalFeedback.total,
			feedback,
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
		const feedback = await Feedback.findById(id);
		if (!feedback.length) {
			return res.status(404).json({
				code: 204,
				message: "Not found Feedback",
			});
		}
		const baseURL = `${req.protocol}://${req.get('host')}`;
		const images = await Image.findByData('entity_id', id);
		feedback[0].images = images.map(img => ({
			...img,
			url: `${baseURL}${img.url}`
		}));
		const status = await Status.findById(feedback[0].status_id);
		feedback[0].status = status.length ? status[0].title : null;

		return res.status(200).json({
			code: 200,
			message: "Get data success",
			feedback: feedback[0],
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
		var data = req.body;
        console.log(data);
        
		const area = await Area.findByData("code", data.area_code);
        console.log(area);
        
		if (area.length == 0) {
			return res
				.status(404)
				.json({
					message: "Area not found with the provided area_code",
				});
		}
        data = {
            ...data,
            area_id : area[0].id
        }
        console.log(data);
        
		const feedback = await Feedback.create(data);

		// Lưu từng ảnh vào bảng Image với feedback_id
		if (req.files && req.files.length > 0) {
			req.files.forEach(async (file) => {
				const relativePath = `/uploads/images/${file.filename}`;
                const dataImage = {
                    url: relativePath,
					entity_id: feedback.id,
					entity_type: "Feedback"
                }
				await Image.create(dataImage);
			});
		}

		return res.status(201).json({
            code: 200,
			message: "Feedback created successfully",
			feedback,
		});
	} catch (error) {
		console.error("Error creating feedback:", error.message);
		return res.status(500).json({
            code: 500,
			message: "Error creating feedback",
			error: error.message,
		});
	}
};

// [PATCH] EDIT
module.exports.edit = async (req, res) => {
	try {
		const { id } = req.params;
		let data = req.body;
		const existedFeedback = await Feedback.findById(id);
		if (existedFeedback.length == 0) {
			return res.status(404).json({
				code: 204,
				message: "Not found Feedback",
			});
		}
		if (data.area_code) {
			const area = await Area.findByData("area_code", data.area_code);
			if (area.length == 0) {
				return res.status(404).json({
					message: "Area not found with the provided area_code",
				});
			}
			data = {
				...data,
				area_id: area[0].id, 
			};
		}
		const feedbackUpdate = await Feedback.updateById(id, data);
		if (feedbackUpdate.success) {
			if (req.files && req.files.length > 0) {
				req.files.forEach(async (file) => {
					const relativePath = `/uploads/images/${file.filename}`;
					const dataImage = {
						url: relativePath,
						entity_id: id,
						entity_type: "Feedback",
					};
					await Image.create(dataImage);
				});
			}

			return res.status(200).json({
				code: 200,
				message: "Update Feedback success",
				feedback: feedbackUpdate.data,
			});
		} else {
			return res.status(500).json({
				code: 500,
				message: "Update Feedback failed",
			});
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
		const existedFeedback = await Feedback.findById(id);
		console.log(existedFeedback);
		if (existedFeedback.length == 0) {
			return res.json({
				code: 204,
				message: "Not found Feedback",
			});
		}
		const feedback = await Feedback.deleteById(id);
		if (feedback) {
			return res.json({
				code: 200,
				message: "Delete Feedback success",
			});
		} else {
			return res.json({
				code: 500,
				message: "Delete Feedback failed",
			});
		}
	} catch (error) {
		return res.Feedback(500).json({
			code: 500,
			message: error.message,
		});
	}
};
