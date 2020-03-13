const data = {
    me: require("../data/me.json"),
    skills: require("./skills.js").list,
    experience: require("./experience.js"),
    education: require("./education.js")
};
const templates = require("./templates.js");
const skillSearch = require("./skillSearch");

const insert = (html, before, data) => {
    let parent = document.createElement("div");
    parent.innerHTML = html;
    resolveCustomElements(parent, data);
    Array.prototype.slice.call(parent.children, 0).forEach((child) => {
        before.parentElement.insertBefore(child, before);
    });
};

const resolveCustomElements = (parent, subData) => {
    subData = subData || {};

    Array.prototype.slice.call(parent.querySelectorAll("nb-placeholder")).forEach((placeholder) => {
        let name = placeholder.innerText.trim();
        let datum = subData[ placeholder.dataset.key ] || data[ placeholder.dataset.key ] || data[ name ] || data;
        let html = templates[ name ](datum);
        insert(html, placeholder, datum);
        placeholder.parentElement.removeChild(placeholder);
    });

    Array.prototype.slice.call(parent.querySelectorAll("nb-repeat")).forEach((repeat) => {
        let name = repeat.innerText.trim();
        let datum = subData[ repeat.dataset.key ] || data[ repeat.dataset.key ] || data[ name ];
        if (datum) {
            datum.forEach((entry) => {
                let html = templates[ name ](entry);
                insert(html, repeat, entry);
            });
        }
        repeat.parentElement.removeChild(repeat);
    });
};

module.exports = () => {
    resolveCustomElements(document);
    document.addEventListener("keyup", skillSearch);

    // if (window.location.host.indexOf("localhost") !== -1) {
    //     let script = document.createElement("script");
    //     document.body.appendChild(script);
    //     script.src = "//localhost:8001/livereload.js";
    // }
};
