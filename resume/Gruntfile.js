module.exports = (grunt) => {
    "use strict";

    let config = {};

    config.pkg = grunt.file.readJSON("package.json");

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require("load-grunt-tasks")(grunt);

    config.hostname = "localhost";
    config.livereload = 8001;
    config.port = 8000;
    config.protocol = "http";

    config.clean = {
        "gen": [ "gen/*" ]
    };

    config.connect = {
        html: {
            base: ".",
            keepalive: false,
            livereload: config.livereload,
            open: false,
            port: config.port,
            protocol: config.protocol
        }
    };

    config.copy = {
        moment: {
            src: "node_modules/moment/min/moment.min.js",
            dest: "gen/moment.min.js"
        }
    };

    config.open = {
        resume: {
            path: config.protocol + "://" + config.hostname + ":" + config.port
        }
    };

    config.sass = {
        all: {
            files: {
                "gen/index.css": "css/*.scss"
            }
        }
    };

    config.watch = {
        all: {
            files: [ "**/*", "!./index.html", "!node_modules", "!node_modules/**/*", "!gen/**/*" ],
            tasks: [ "assets" ],
            options: {
                livereload: config.livereload,
                livereloadOnError: false,
                reload: true,
                spawn: false
            }
        }
    };

    grunt.initConfig(config);

    grunt.registerTask("glob", () => {
        grunt.file.expand(config.watch.all.files).forEach(file => grunt.log.writeln(`\n${file}`));
    });

    let src = "html/index.html";
    grunt.registerTask("reset", () => {
        src = "html/index.html";
    });
    grunt.registerTask("sort", () => {
        let file = "data/skills.json";
        let skills = grunt.file.read(file);
        skills = JSON.parse(skills);
        skills.sort((a, b) => {
            return a.shortName.toLowerCase() < b.shortName.toLowerCase() ? -1 : 1;
        });
        grunt.file.write(file, JSON.stringify(skills, null, "  "));
    });
    grunt.registerTask("css", () => {
        let css, files;
        css = "";
        files = grunt.file.expand("gen/*.css");
        files.forEach(function forEachFile(file) {
            let filename = file.split("/").pop();
            css += `\n    <link rel=\"stylesheet\" href="${file}"></link>`;
        });
        let html = grunt.file.read(src);
        html = html.replace("<!--STYLES-->", css);
        src = "index.html";
        grunt.file.write(src, html);
    });
    grunt.registerTask("data", () => {
        let files = grunt.file.expand("data/*.json");
        files.forEach(function forEachFile(file) {
            let filename = file.split("/").pop().replace(".json", "");
            let data = grunt.file.read(file);
            let content = `((data) => {\n    "use strict";\n    data[ "${filename}" ] = ${data};\n})(window.nb.data);`;
            grunt.file.write("gen/" + filename + "Data.js", content);
        });
    });
    grunt.registerTask("html", () => {
        let files;
        files = grunt.file.expand("html/*.html");
        files.forEach(function forEachFile(file) {
            let filename = file.split("/").pop().replace(".html", "");
            if (filename === "index") {
                return;
            }
            let template = grunt.file.read(file);
            let content = `((templates) => {\n    "use strict";\n    templates[ "${filename}" ] = templates._\`${template}\`;\n})(window.nb.templates);`;
            grunt.file.write("gen/" + filename + "Template.js", content);
        });
    });
    grunt.registerTask("js", () => {
        let scripts, files;
        scripts = "";
        files = grunt.file.expand("gen/*.js");
        grunt.log.writeln(JSON.stringify(files, null, "   "));
        files.forEach(function forEachFile(file) {
            let filename = file.split("/").pop();
            if (filename === "namespace.js") {
                return;
            }
            scripts += `\n    <script src="${file}"></script>`;
        });
        let html = grunt.file.read(src);
        html = html.replace("<!--NAMESPACE-->", `\n    <script src="js/namespace.js"></script>`);
        html = html.replace("<!--SCRIPTS-->", scripts);
        html = html.replace("<!--INDEX-->", `\n    <script src="js/index.js"></script>`);
        src = "index.html";
        grunt.file.write(src, html);
    });
    grunt.registerTask("assets", [ "reset", "sass", "css", "data", "html", "copy", "js", "reset" ]);
    grunt.registerTask("launch", [ "clean", "assets", "connect", "open", "watch" ]);
    grunt.registerTask("relaunch", [ "clean", "assets", "connect", "watch" ]);
};
