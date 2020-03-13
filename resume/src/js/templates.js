const raw = {
    address: require("../html/address.html"),
    art: require("../html/art.html"),
    resume: require("../html/body.html"),
    contact: require("../html/contact.html"),
    education: require("../html/education.html"),
    experience: require("../html/experience.html"),
    name: require("../html/name.html"),
    overview: require("../html/overview.html"),
    portfolio: require("../html/portfolio.html"),
    positions: require("../html/positions.html"),
    responsibilities: require("../html/responsibilities.html"),
    skillListWidget: require("../html/skillListWidget.html"),
    skills: require("../html/skills.html")
};

const REG_EXP = /\$\{/g;

const evaluate = (obj, key) => {
    if (!obj) {
        return "";
    }
    const keys = key.split(".");
    const value = obj[ keys.shift() ];
    if (keys.length) {
        return evaluate(value, keys.join("."));
    }
    return typeof value === "undefined" ? "" : value;
};

const makeTemplate = (string) => {
    // TODO: weird bug where REG_EXP doesn't match the first time
    if (!REG_EXP.test(string) && !REG_EXP.test(string)) {
        // There are no placeholders, always return the static string
        return () => string;
    }
    return (params) => {
        function taggedTemplate(unmutableStrings, ...values) {
            let strings = unmutableStrings.slice(0);
            let result = values.reduce((result, key) => {
                const str = strings.shift();
                // TODO: handle dot notation in key
                const value = evaluate(params, key);
                const r = result + str + value;
                return r;
            }, "");
            result += strings.shift();
            return result;
        }
        const result = eval(`taggedTemplate\`${string}\``);
        return result;
    };
};

const templates = {};
Object.keys(raw).forEach((key) => {
    templates[ key ] = makeTemplate(raw[ key ]);
});

module.exports = templates;
