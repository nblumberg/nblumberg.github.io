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
                if (position.skills) {
                    position.skills.sort();
                    position.skills = position.skills.map((skill) => {
                        return skillMap[ skill.toLowerCase() ] || { "shortName": skill, "longName": skill };
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
})(window.nb.data, window.nb.templates, window.document, window.moment);
