((window, rootData, templates, document, moment) => {
    "use strict";

    let skillMap = {};

    rootData.skills.sort((a, b) => {
        return a.shortName.toLowerCase() < b.shortName.toLowerCase() ? -1 : 1;
    });
    rootData.skills.forEach((skill) => {
        skillMap[ skill.shortName.toLowerCase() ] = skill;
    });

    rootData.experience.forEach((experience) => {
        if (experience.positions) {
            experience.positions.forEach((position) => {
                if (position.dates) {
                    let m;
                    if (position.dates.start) {
                        m = moment(position.dates.start);
                        position.dates.start = {
                            month: m.format("MMMM"),
                            shortMonth: m.format("MMM"),
                            year: m.format("YYYY"),
                            shortYear: "'" + m.format("YY")
                        };
                    }
                    if (position.dates.end) {
                        m = moment(position.dates.end);
                        position.dates.end = {
                            month: m.format("MMMM"),
                            shortMonth: m.format("MMM"),
                            year: m.format("YYYY"),
                            shortYear: "'" + m.format("YY")
                        };
                    }
                }
                if (position.responsibilities) {
                    position.responsibilities.forEach((responsibility) => {
                        if (responsibility.skills) {
                            responsibility.skills.sort((a, b) => {
                                return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
                            });
                            responsibility.skills = responsibility.skills.map((skill) => {
                                return skillMap[ skill.toLowerCase() ] || { "shortName": skill, "longName": skill, "experienceLevel": "familiar" };
                            });
                        }
                    });
                }
            });
        }
    });
    rootData.education.forEach((school) => {
        if (school.dates) {
            let m;
            if (school.dates.start) {
                m = moment(school.dates.start);
                school.dates.start = {
                    month: m.format("MMMM"),
                    shortMonth: m.format("MMM"),
                    year: m.format("YYYY"),
                    shortYear: "'" + m.format("YY")
                };
            }
            if (school.dates.end) {
                m = moment(school.dates.end);
                school.dates.end = {
                    month: m.format("MMMM"),
                    shortMonth: m.format("MMM"),
                    year: m.format("YYYY"),
                    shortYear: "'" + m.format("YY")
                };
            }
        }
    });

    function insert(html, before, data) {
        let parent = document.createElement("div");
        parent.innerHTML = html;
        resolveCustomElements(parent, data);
        Array.prototype.slice.call(parent.children, 0).forEach((child) => {
            before.parentElement.insertBefore(child, before);
        });
    }

    function resolveCustomElements(parent, subData) {
        subData = subData || {};

        Array.prototype.slice.call(parent.querySelectorAll("nb-placeholder")).forEach((placeholder) => {
            let name = placeholder.innerText.trim();
            let data = subData[ placeholder.dataset.key ] || rootData[ placeholder.dataset.key ] || rootData[ name ];
            let html = templates[ name ](data);
            insert(html, placeholder, data);
            placeholder.parentElement.removeChild(placeholder);
        });

        Array.prototype.slice.call(parent.querySelectorAll("nb-repeat")).forEach((repeat) => {
            let name = repeat.innerText.trim();
            let data = subData[ repeat.dataset.key ] || rootData[ repeat.dataset.key ] || rootData[ name ];
            if (data) {
                data.forEach((entry) => {
                    let html = templates[ name ](entry);
                    insert(html, repeat, entry);
                });
            }
            repeat.parentElement.removeChild(repeat);
        });
    }

    resolveCustomElements(document);

    document.addEventListener("keyup", (event) => {
        if (event.target.className !== "searchSkills") {
            return;
        }
        let input = event.target;
        let skillList = input.parentElement.parentElement.parentElement;
        let skills = Array.prototype.slice.call(skillList.querySelectorAll(".js-skill"));
        let terms = input.value.toLowerCase().split(/(\s+|,)/);
        skills.forEach((skill) => {
            skill.className = "skill js-skill";
            if (terms.length) {
                skill.className = "skill js-skill hidden";
                terms.forEach((term) => {
                    if (skill.dataset.skill.toLowerCase().indexOf(term) !== -1) {
                        skill.className = "skill js-skill";
                    }
                });
            }
        });
    });

    if (window.location.host.indexOf("localhost") !== -1) {
        let script = document.createElement("script");
        document.body.appendChild(script);
        script.src = "//localhost:8001/livereload.js";
    }
})(window, window.nb.data, window.nb.templates, window.document, window.moment);
