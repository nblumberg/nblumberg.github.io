((rootData, templates, document, moment) => {
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
                    if (position.dates.start) {
                        position.dates.start = moment(position.dates.start).format("MMMM YYYY");
                    }
                    if (position.dates.end) {
                        position.dates.end = moment(position.dates.end).format("MMMM YYYY");
                    }
                }
                if (position.responsibilities) {
                    position.responsibilities.forEach((responsibility) => {
                        if (responsibility.skills) {
                            responsibility.skills.sort();
                            responsibility.skills = responsibility.skills.map((skill) => {
                                return skillMap[ skill.toLowerCase() ] || { "shortName": skill, "longName": skill };
                            });
                        }
                    });
                }
            });
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
            data.forEach((entry) => {
                let html = templates[ name ](entry);
                insert(html, repeat, entry);
            });
            repeat.parentElement.removeChild(repeat);
        });
    }

    resolveCustomElements(document);

    // Array.prototype.slice.call(document.querySelectorAll(".skillList")).forEach((skillList) => {
    //     let widget = document.createElement("span");
    //     widget.className = "widget";
    //     skillList.insertBefore(widget, skillList.children[ 0 ]);
    // });

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
})(window.nb.data, window.nb.templates, window.document, window.moment);
