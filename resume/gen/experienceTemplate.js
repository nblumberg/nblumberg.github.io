((templates) => {
    "use strict";
    templates[ "experience" ] = templates._`<div class="experience ${'name'}">
    <header>
        <img class="logo" src="${'logo'}" />
        <h3>
            <a href="${'website'}" class="name">${"name"}</a>
            <div class="portfolio" data-show="${'portfolio'}">
                <div class="coverflow-container">
                    <ol class="coverflow-list">
                        <nb-repeat data-key="portfolio">art</nb-repeat>
                    </ol>
                </div>
            </div>
        </h3>
        <nb-placeholder data-key="address">address</nb-placeholder>
    </header>
    <!--<div class="company-overview" data-show="${'summary'}${'portfolio'}">-->
    <!--</div>-->
    <article class="summary">${"summary"}</article>
    <nb-repeat data-key="positions" class="positions">positions</nb-repeat>
</div>
`;
})(window.nb.templates);