const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage }).array('images', 10);

const uploadMiddleware = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error uploading images', error: err.message });
        }
        next();
    });
};

module.exports = uploadMiddleware;
