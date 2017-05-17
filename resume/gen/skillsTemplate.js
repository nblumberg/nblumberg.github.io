((templates) => {
    "use strict";
    templates[ "skills" ] = templates._`<div class="skill js-skill" data-skill="${'shortName'}">
    <div class="term ${'experienceLevel'}">
        <a href="${'website'}" target="_blank">${"shortName"}</a>
    </div>
    <div class="details" data-show="${'fullName'}">
        <div class="fullName">${"fullName"}</div>
        <div class="description">${"description"}</div>
    </div>
</div>

`;
})(window.nb.templates);