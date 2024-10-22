const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

module.exports.genQRBase64 = async (text) => {
    try {
        if (!text || text.trim() === "") {
            return "";
        }

        const qrCodeData = await QRCode.toDataURL(text);
        return qrCodeData;
    } catch (error) {
        console.error("Error generating QR code (Base64):", error.message);
        throw new Error("Failed to generate QR code");
    }
};

module.exports.generateQRCodeFile = async (text, filename) => {
	try {
		const filePath = path.join(
			__dirname,
			`../public/qrcodes/${filename}.png`
		);

		if (!fs.existsSync(path.dirname(filePath))) {
			fs.mkdirSync(path.dirname(filePath), { recursive: true });
		}
		await QRCode.toFile(filePath, text);

		return `/qrcodes/${filename}.png`;
	} catch (error) {
		console.error("Error generating QR code (File):", error.message);
		throw new Error("Failed to generate QR code file");
	}
};
