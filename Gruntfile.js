module.exports = grunt => {
    "use strict";

    var config = {};

    config.pkg = grunt.file.readJSON("package.json");

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require("load-grunt-tasks")(grunt);

    config.hostname = "127.0.0.1";
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
            path: config.protocol + "://" + config.hostname + ":" + config.port + "/html/resume.html"
        }
    };

    config.watch = {
        all: {
            files: "**/*",
            tasks: [],
            options: {
                livereload: config.livereload,
                reload: true,
                spawn: false
            }
        }
    };

    grunt.initConfig(config);

    grunt.registerTask("launch", [ "connect", "open", "watch" ]);

};