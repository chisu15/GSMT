// Hàm chuyển đổi DateTime2 sang Date
function convertDateTime2ToDate(dateTime2String) {
    if (!dateTime2String) {
        console.error("Invalid DateTime2 string provided:", dateTime2String);
        return null;
    }

    try {
        // Chuyển đổi chuỗi DateTime2 (ISO 8601) thành đối tượng Date của JavaScript
        const dateObject = new Date(dateTime2String);

        // Kiểm tra tính hợp lệ của đối tượng Date
        if (isNaN(dateObject.getTime())) {
            console.error("Invalid DateTime2 format:", dateTime2String);
            return null;
        }

        // Trả về đối tượng Date hợp lệ
        return dateObject;
    } catch (error) {
        console.error("Error converting DateTime2 to Date:", error);
        return null;
    }
}

// Hàm tính số phút từ lần cuối thiết bị hoạt động
// Hàm tính số phút từ lần cuối thiết bị hoạt động
module.exports.calculateMinutesAgo = (lastActiveTime) => {
    const nowUTC = Date.now(); 
    const lastActiveUTC = new Date(lastActiveTime).getTime();
    const diffMs = nowUTC - lastActiveUTC;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes >= 0 ? diffMinutes : 0; 
};
