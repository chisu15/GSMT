const moment = require('moment-timezone');


// module.exports.calculateMinutesAgo = (lastActiveTime) => {
//     let now = new Date.now();
//     console.log(now);
    
//     const diffMilliseconds = now.diff(lastActive);
//     const diffMinutes = Math.abs(Math.floor(diffMilliseconds / (1000 * 60))); 
//     if (diffMinutes < 60) {
//         return `${diffMinutes} phút trước`;
//     } else if (diffMinutes < 1440) {  // 1440 phút = 24 giờ
//         const diffHours = Math.floor(diffMinutes / 60);
//         return `${diffHours} giờ trước`;
//     } else {
//         const diffDays = Math.floor(diffMinutes / 1440);
//         return `${diffDays} ngày trước`;
//     }
// };

module.exports.formatDate = (date) => {
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    var months = date.getUTCMonth() + 1;
    var day = date.getUTCDate();

    day = day < 10 ? "0" + day : day;
    months = months < 10 ? "0" + months : months;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var strTime = hours + ":" + minutes;
    return strTime + " " + day + "-" + months + "-" + date.getFullYear();
};
