const moment = require("moment");
const data = require("../data/experience.json");
const skills = require("./skills.js");
const formatDate = require("./formatDate.js");

const URL_PARAMS = new URLSearchParams(window.location.search);
const LIMIT_EXPERIENCE = parseInt(URL_PARAMS.get("limit"), 10) || 12;
const LIMIT_PRIORITY = parseInt(URL_PARAMS.get("priority"), 10) || -1;

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
 * Deep copies a job Object, formatting its dates, positions, achievements, and skills for display
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
    // Get the positions held at the job
    let positions = (data.positions || []).map(mapPosition);
    // Exclude any position limited by URL parameter for a leaner resume
    positions = positions.filter(position => position !== null && position.priority >= LIMIT_PRIORITY);
    if (!positions.length) {
        return null;
    }
    job.positions = positions;

    // Since the positions contain the dates, determine the overall dates at the job from the positions
    const startSortedPositions = positions.slice(0).sort(({ dates: { start: { moment: a } } }, { dates: { start: { moment: b } } }) => !a || a.isSameOrAfter(b) ? 1 : -1);
    const startDate = startSortedPositions[0].dates.start.source;
    const endSortedPositions = positions.slice(0).sort(({ dates: { end: { moment: a } = {} } }, { dates: { end: { moment: b } = {} } }) => !a || a.isSameOrAfter(b) ? -1 : 1);
    const endDate = endSortedPositions[0].dates.end ? endSortedPositions[0].dates.end.source : null
    const overallPosition = {
        dates: {
            start: startDate
        }
    };
    if (endDate) {
        overallPosition.dates.end = endDate;
    }
    formatDates(overallPosition);
    job.dates = overallPosition.dates;

    // If there's only one position, the job will display the dates
    if (positions.length === 1) {
        positions[0].dates = "";
    }

    // Get the achievements at the job
    let achievements = (data.achievements || []).map(mapPosition);
    // Exclude any achievement limited by URL parameter for a leaner resume
    achievements = achievements.filter(achievement => achievement !== null && achievement.priority >= LIMIT_PRIORITY);
    if (!achievements.length) {
        job.achievments = "";
    } else {
        job.achievements = achievements;
    }

    return job;
};

const experience = data.map(mapJob).filter(job => job !== null);

module.exports = experience;
