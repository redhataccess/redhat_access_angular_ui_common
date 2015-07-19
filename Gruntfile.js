// Generated on 2014-02-17 using generator-angular 0.7.1
/*jshint camelcase: false */
'use strict';
// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
//var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-angular-gettext');
    // Define the configuration for all the tasks
    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' + ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        yeoman: {
            app: require('./bower.json').appPath || 'app',
            dist: 'dist',
            bowerDir: grunt.file.readJSON('.bowerrc').directory
        },
        src: {
            js: [
                'app/**/*.module.js',
                'app/common/**/*.js',
                'app/security/**/*.js'
            ],
            jsTpl: ['.tmp/templates/**/*.js'],
            specs: ['test/**/*.spec.js'],
            scenarios: ['test/**/*.scenario.js'],
            tpl: {
                app: [
                    'app/common/**/*.html',
                    'app/security/**/*.html'
                ]
            },
            i18n: {
                generated: ['<%= yeoman.app %>/i18n/translations.js']
            }
        },
        nggettext_extract: {
            options: {
                markerName: 'translate'
            },
            pot: {
                files: {
                    '<%= yeoman.app %>/i18n/template.pot': [
                        '<%= src.tpl.app %>',
                        '<%= src.js %>',
                        '<%= yeoman.app %>/i18n/placeholder.html'
                    ]
                }
            }
        },
        nggettext_compile: {
            all: {
                files: {
                    '<%= yeoman.app %>/i18n/translations.js': ['<%= yeoman.app %>/i18n/*.po']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= src.js %>'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            },
            files: grunt.option('files') ? grunt.option('files').split(' ') : []
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            hooks: ['.git/hooks/pre-commit']
        },
        // 'bower-install': {
        //     app: {
        //         html: '<%= yeoman.app %>/index.html',
        //         ignorePath: '<%= yeoman.app %>/'
        //     }
        // },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        // useminPrepare: {
        //     html: '.tmp/index.html',
        //     options: {
        //         dest: '<%= yeoman.dist %>'
        //     }
        // },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },
        // imagemin: {
        //     dist: {
        //         files: [{
        //             expand: true,
        //             cwd: '<%= yeoman.app %>/images',
        //             src: '{,*/}*.{png,jpg,jpeg,gif}',
        //             dest: '<%= yeoman.dist %>/images'
        //         }]
        //     }
        // },
        // svgmin: {
        //     dist: {
        //         files: [{
        //             expand: true,
        //             cwd: '<%= yeoman.app %>/images',
        //             src: '{,*/}*.svg',
        //             dest: '<%= yeoman.dist %>/images'
        //         }]
        //     }
        // },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp',
                    src: ['{,*/}*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        jade: {
            dist: {
                options: {
                    pretty: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.app %>',
                    src: '**/*.jade',
                    ext: '.html'
                }]
            }
        },
        ngAnnotate: {
            options: {},
            // dist: {
            //     files: [{
            //         src: '.tmp/<%= pkg.name %>-deps.js',
            //         dest: '<%= distdir %>/js/<%= pkg.name %>-deps.js'
            //     }]
            // },
            distNoDeps: {
                files: [{
                    src: '.tmp/<%= pkg.name %>.js',
                    dest: '<%= distdir %>/<%= pkg.name %>.js'
                }]
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'views/{,*/}*.html',
                        'bower_components/**/*',
                        'images/{,*/}*.{webp}',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }]
            },
            styles: {
                expand: true,
                filter: 'isFile',
                flatten: true,
                dest: '.tmp/styles/',
                src: '<%= src.css.app %>'
            },
            images: {
                files: [{
                    expand: true,
                    flatten: true,
                    nonull: true,
                    src: '<%= src.img %>',
                    dest: '<%= yeoman.dist %>/img/',
                    filter: 'isFile'
                }]
            //     }, {
            //         expand: true,
            //         flatten: true,
            //         nonull: true,
            //         src: '<%= src.thirdParty.img %>',
            //         dest: '<%= yeoman.dist %>/img/',
            //         filter: 'isFile'
            //     }, {
            //         expand: true,
            //         flatten: true,
            //         nonull: true,
            //         src: '<%= yeoman.bowerDir%>/chosen/*.png',
            //         dest: '<%= yeoman.dist %>/styles',
            //         filter: 'isFile'
                
            }
        },
        // concurrent: {
        //     server: ['copy:styles'],
        //     test: ['copy:styles'],
        //     dist: [
        //         'copy:styles'
        //         // 'imagemin',
        //         // 'svgmin'
        //     ]
        // },
        imageEmbed: {
            // dist: {
            //     src: ['<%= yeoman.dist %>/styles/<%= pkg.name %>-deps.css'],
            //     dest: '<%= yeoman.dist %>/styles/<%= pkg.name %>-deps-embedded-images.css',
            //     options: {
            //         deleteAfterEncoding: false
            //     }
            // },
            distNoDeps: {
                src: ['<%= yeoman.dist %>/styles/<%= pkg.name %>.css'],
                dest: '<%= yeoman.dist %>/styles/<%= pkg.name %>-embedded-images.css',
                options: {
                    deleteAfterEncoding: false
                }
            }
        },
        shell: {
            hooks: {
                command: 'cp hooks/pre-commit .git/hooks/'
            }
        },
        // cssmin: {
        //     // dist: {
        //     //     files: {
        //     //         '<%= yeoman.dist %>/styles/<%= pkg.name %>-deps.css': [
        //     //             '<%= src.thirdParty.css %>'
        //     //         ]
        //     //     }
        //     // },
        //     distNoDeps: {
        //         files: {
        //             '<%= yeoman.dist %>/styles/<%= pkg.name %>.css': ['<%= src.css.app %>']
        //         }
        //     }
        // },
        concat: {
            // dist: {
            //     options: {
            //         banner: '<%= banner %>'
            //     },
            //     src: [
            //         '<%= src.thirdParty.js %>'
            //     ],
            //     dest: '.tmp/<%= pkg.name %>-deps.js',
            //     nonull: true
            // },
            distNoDeps: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    '<%= src.i18n.generated %>',
                    '<%= src.js %>',
                    '<%= src.jsTpl %>'
                ],
                dest: '.tmp/<%= pkg.name %>.js',
                nonull: true
            }
        },
        html2js: {
            app: {
                options: {
                    base: 'app'
                },
                src: ['<%= src.tpl.app %>'],
                dest: '.tmp/templates/RedhatAccess.template.js',
                module: 'RedhatAccess.template'
            }
        },
    });
    // grunt.registerTask('serve', function (target) {
    //     if (target === 'dist') {
    //         return grunt.task.run([
    //             'build',
    //             'connect:dist:keepalive'
    //         ]);
    //     }
    //     grunt.task.run([
    //         'clean:server',
    //         'bower-install',
    //         'newer:jade',
    //         'build'
    //     ]);
    // });
    // grunt.registerTask('test', [
    //     'html2js',
    //     'concurrent:test',
    //     //'autoprefixer',
    //     'connect:test'
    // ]);
    grunt.registerTask('build', [
        'clean:dist',
        // 'bower-install',
        'newer:jade',
	    // 'useminPrepare',
        'html2js',
        // 'concurrent:dist',
        //'autoprefixer',
        'nggettext_compile',
        'concat',
        'ngAnnotate',
        //'copy:images',
        //'cssmin',
        //'imageEmbed',
        'htmlmin'
        //'test'
    ]);
    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);
};
