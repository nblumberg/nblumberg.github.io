const data = require("../data/education.json");
const formatDate = require("./formatDate.js");

const mapSchool = (data) => {
    const school = Object.assign({}, data);
    if (school.dates) {
        return school;
    }
    if (school.dates.start) {
        school.dates.start = formatDate(school.dates.start);
    }
    if (school.dates.end) {
        school.dates.end = formatDate(school.dates.end);
    }
    return school;
};

const education = data.map(mapSchool);

module.exports = education;
