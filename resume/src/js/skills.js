const data = require("../data/skills.json");
const map = {};

const list = Array.isArray(data) ? data.slice(0) : [];
list.sort((a, b) => {
    return a.shortName.toLowerCase() < b.shortName.toLowerCase() ? -1 : 1;
});
list.forEach((skill) => {
    map[ skill.shortName.toLowerCase() ] = Object.assign({}, skill);
});

module.exports = {
    list,
    map
};
