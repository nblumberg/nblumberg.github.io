((templates) => {
    "use strict";
    templates[ "art" ] = templates._`<!-- Cover item -->
<input type="radio" name="cover-item" id="${'name'}">
<li class="coverflow-item">
    <a href="${'website'}">
        <label for="${'name'}">
            <figure class="album-cover">
                <img src="${'image'}">
                <figcaption class="album-name">${"name"}</figcaption>
            </figure>
        </label>
    </a>
</li>
`;
})(window.nb.templates);