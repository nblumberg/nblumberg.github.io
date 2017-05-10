module.exports = function gruntConfig(grunt) {
    "use strict";

    let config = {};

    config.pkg = grunt.file.readJSON("package.json");

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require("load-grunt-tasks")(grunt);

    config.hostname = "localhost";
    config.livereload = 8001;
    config.port = 8000;
    config.protocol = "http";

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

    config.open = {
        resume: {
            path: config.protocol + "://" + config.hostname + ":" + config.port + "/resume.html"
        }
    };

    config.sass = {
        all: {
            files: {
                "css/index.css": "css/*.scss"
            }
        }
    };

    config.watch = {
        all: {
            files: [ "**/*", "!resume.html", "!node_modules", "!node_modules/**/*" ],
            tasks: [ "assets" ],
            options: {
                livereload: config.livereload,
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
        files = grunt.file.expand("css/*.css");
        files.forEach(function forEachFile(file) {
            let filename = file.split("/").pop();
            css += `\n    <link rel=\"stylesheet\" href="${file}"></link>`;
        });
        let html = grunt.file.read(src);
        html = html.replace("<!--STYLES-->", css);
        src = "resume.html";
        grunt.file.write(src, html);
    });
    grunt.registerTask("data", () => {
        let scripts, files;
        scripts = "<script>";
        files = grunt.file.expand("data/*.json");
        files.forEach(function forEachFile(file) {
            let filename = file.split("/").pop().replace(".json", "");
            let data = grunt.file.read(file);
            scripts += `\n        window.nb.data[ "${filename}" ] = ${data};`;
        });
        scripts += "\n    </script>";
        let html = grunt.file.read(src);
        html = html.replace("<!--DATA-->", scripts);
        src = "resume.html";
        grunt.file.write(src, html);
    });
    grunt.registerTask("html", () => {
        let scripts, files;
        scripts = "<script>";
        files = grunt.file.expand("html/*.html");
        files.forEach(function forEachFile(file) {
            let filename = file.split("/").pop().replace(".html", "");
            if (filename === "index") {
                return;
            }
            let template = grunt.file.read(file);
            scripts += `\n        window.nb.templates[ "${filename}" ] = window.nb.templates._\`${template}\`;`;
        });
        scripts += "\n    </script>";
        let html = grunt.file.read(src);
        html = html.replace("<!--TEMPLATES-->", scripts);
        src = "resume.html";
        grunt.file.write(src, html);
    });
    grunt.registerTask("js", () => {
        let scripts, files;
        scripts = "";
        files = grunt.file.expand("js/*.js");
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
        src = "resume.html";
        grunt.file.write(src, html);
    });
    grunt.registerTask("assets", [ "reset", "sass", "css", "js", "data", "html", "reset" ]);
    grunt.registerTask("launch", [ "assets", "connect", "open", "watch" ]);
    grunt.registerTask("relaunch", [ "assets", "connect", "watch" ]);

};