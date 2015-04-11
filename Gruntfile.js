module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '// francis.js v<%= pkg.version %>'
        },

        preprocess: {
            options: {
                context: {
                    banner: '<%= meta.banner %>'
                }
            },
            all: {
                src: 'francis.js',
                dest: 'dist/francis.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            all: {
                src: '<%= preprocess.all.dest %>',
                dest: '<%= preprocess.all.dest.replace(/\.js/, \'.min.js\') %>',
                options: {
                    sourceMap: true
                }
            }
        },

        jshint: {
            all: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: ['francis.js']
            }
        },

        mochaTest: {
            test: {
                options: {
                    require: 'test/setup.js',
                    clearRequireCache: true,
                    reporter: 'dot'
                },
                src: ['test/**/*.spec.js']
            }
        }
    });

    grunt.registerTask('build', 'Generate dist files', ['test', 'preprocess', 'uglify']);
    grunt.registerTask('test', 'Run jshint and tests.', ['jshint', 'mochaTest']);
    grunt.registerTask('default', ['test']);
};
