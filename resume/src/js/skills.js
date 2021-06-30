const data = require("../data/skills.json");
const map = {};

let list = Array.isArray(data) ? data.slice(0) : [];
list.sort((a, b) => {
    return a.shortName.toLowerCase() < b.shortName.toLowerCase() ? -1 : 1;
});
list.forEach((skill) => {
    map[ skill.shortName.toLowerCase() ] = Object.assign({}, skill);
});
list = list.filter((skill) => !skill.deprecated);

module.exports = {
    list,
    map
};
