const moment = require("moment");

/**
 * Break date down into component values for HTML rendering
 * @param {String} date In the format "MM/DD/YYYY"
 * @returns {{shortMonth: string, month: string, year: string, shortYear: string}}
 */
const formatDate = (date) => {
    if (!date) {
        return;
    }
    const m = moment(date);
    return {
        month: m.format("MMMM"),
        shortMonth: m.format("MMM"),
        year: m.format("YYYY"),
        shortYear: "'" + m.format("YY")
    };
};

module.exports = formatDate;
