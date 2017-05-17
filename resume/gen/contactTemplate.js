((templates) => {
    "use strict";
    templates[ "contact" ] = templates._`<section class="contact">
    <a href="tel:+${'phone'}" class="phone">${"phone"}</a>
    <a href="mailto:${'email'}" class="email">${"email"}</a>
</section>
`;
})(window.nb.templates);