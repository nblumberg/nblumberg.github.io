((templates) => {
    "use strict";
    templates[ "experience" ] = templates._`<div class="experience">
    <header>
        <img class="logo" src="${'logo'}" />
        <h3>
            <a href="${'website'}" class="name">${"name"}</a>
        </h3>
        <nb-placeholder data-key="address">address</nb-placeholder>
    </header>
    <article class="summary">${"summary"}</article>
    <nb-repeat data-key="positions" class="positions">positions</nb-repeat>
</div>
`;
})(window.nb.templates);