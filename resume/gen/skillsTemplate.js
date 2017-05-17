((templates) => {
    "use strict";
    templates[ "skills" ] = templates._`<div class="skill">
    <div class="term ${'experienceLevel'}">
        <a href="${'website'}" target="_blank">${"shortName"}</a>
    </div>
    <div class="details">
        <div class="fullName">${"fullName"}</div>
        <div class="description">${"description"}</div>
    </div>
</div>

`;
})(window.nb.templates);