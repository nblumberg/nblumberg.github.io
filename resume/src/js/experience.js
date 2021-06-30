const moment = require("moment");
const data = require("../data/experience.json");
const skills = require("./skills.js");
const formatDate = require("./formatDate.js");

const URL_PARAMS = new URLSearchParams(window.location.search);
const LIMIT_EXPERIENCE = parseInt(URL_PARAMS.get("limit"), 10) || 12;
const LIMIT_PRIORITY = parseInt(URL_PARAMS.get("priority"), 10) || 0;

/**
 * Replace string start/end dates with maps containing their component values for HTML rendering
 * @param {Object} position {{ dates: { start: string[, end: string] } }}
 */
const formatDates = (position) => {
    if (!position.dates) {
        return;
    }
    if (position.dates.start) {
        position.dates.start = formatDate(position.dates.start);
    }
    if (position.dates.end) {
        position.dates.end = formatDate(position.dates.end);
    }
};

/**
 * Deep-copies a responsibility Object and replaces skill names with skill Objects
 * @param {Object} data {{ description: string[, skills: string[] ] }}
 * @returns {{ description: string[, skills: object[] ] }}
 */
const mapResponsibility = (data) => {
    const responsibility = Object.assign({}, data);
    if (!responsibility.skills) {
        return responsibility;
    }
    responsibility.skills.sort((a, b) => {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });
    responsibility.skills = responsibility.skills.sort().map((skill) => {
        return skills.map[ skill.toLowerCase() ] || { "shortName": skill, "longName": skill, "experienceLevel": "unknown" };
    });
    return responsibility;
};

/**
 * Deep copies a position Object, formatting its dates and skills for display
 * @param {Object} data {{ name: string, dates: { start: see formatDate[, end: see formatDate] }, summary: string, responsibilities: [ see mapResponsibility, ... ] }}
 * @returns {{ name: string, dates: { start: see formatDate[, end: see formatDate] }, summary: string, responsibilities: [ see mapResponsibility, ... ] }}
 */
const mapPosition = (data) => {
    const position = Object.assign({ priority: 1 }, data);
    if (data.dates) {
        position.dates = Object.assign({}, data.dates);
    }
    const recentDate = moment.max(moment(position.dates.start || 0), moment(position.dates.end || 0));
    if (moment.duration(moment().diff(recentDate)).asYears() > LIMIT_EXPERIENCE) {
        // Exclude anything > 20 years old
        return null;
    }
    formatDates(position);
    position.responsibilities = (data.responsibilities || []).map(mapResponsibility);
    return position;
};

/**
 * Deep copies a job Object, formatting its dates and skills for display
 * @param {Object} data {{ name: string, address: {}, logo: URL, website: URL, summary: string, positions: [ see mapPosition ] }}
 * @returns {any}
 */
const mapJob = (data) => {
    // Deep copy the raw data before manipulating it
    const job = Object.assign({}, data);

    if (job.logo && job.logo.indexOf("img/") === 0) {
        // local image
        job.logo = require(`../${job.logo}`);
    }
    if (Array.isArray(job.portfolio)) {
        job.portfolio.forEach(entry => {
            if (entry.image.indexOf("img/") === 0) {
                // local image
                entry.image = require(`../${entry.image}`);
            }
        });
    }

    if (data.address) {
        job.address = Object.assign({}, data.address);
    }
    job.positions = (data.positions || []).map(mapPosition);
    // Exclude anything limited by URL parameter for a leaner resume
    job.positions = job.positions.filter(position => position !== null && position.priority >= LIMIT_PRIORITY);
    if (!job.positions.length) {
        return null;
    }

    return job;
};

const experience = data.map(mapJob).filter(job => job !== null);

module.exports = experience;
