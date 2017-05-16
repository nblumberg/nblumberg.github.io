((rootData, templates, document) => {
    "use strict";

    rootData.skills.sort((a, b) => {
        return a.shortName.toLowerCase() < b.shortName.toLowerCase() ? -1 : 1;
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
            let data = subData[ repeat.dataset.key ] || rootData[ repeat.dataset.key ] || rootData[ name ];            data.forEach((entry) => {
                let html = templates[ name ](entry);
                insert(html, repeat, entry);
            });
            repeat.parentElement.removeChild(repeat);
        });
    }

    resolveCustomElements(document);
})(window.nb.data, window.nb.templates, window.document);
