/*jshint node: true, camelcase: false */

'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'Gruntfile.js',
        'jquery.iframe-transport.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      },
      build: {
        files: {
          'build/jquery.iframe-transport-<%= pkg.version %>.min.js': 'jquery.iframe-transport.js'
        }
      }
    },
    docco: {
      debug: {
        src: ['jquery.iframe-transport.js'],
        options: {
          output: 'docs/'
        }
      }
    },
    'gh-pages': {
      options: {
        base: 'docs'
      },
      src: ['**']
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) {
      grunt.loadNpmTasks(key);
    }
  }

  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.registerTask('doc', ['docco', 'gh-pages']);
};
