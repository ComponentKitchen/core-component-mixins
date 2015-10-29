module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({

    browserify: {
      options: {
        browserifyOptions: {
          debug: false // true
        },
        transform: [['babelify']]
      },
      dist: {
        files: {
          'dist/ElementBase.js': 'src/ElementBase.js'
        }
      },
      demos: {
        files: {
          'build/demos.js': ['demos/*.js', 'demos/**/*.js']
        }
      },
      test: {
        files: {
          'build/tests.js': 'test/*.tests.js'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'demos/*.js',
          'demos/**/*.js',
          'extensible/*.js',
          'src/*.js',
          'test/*.js'
        ],
        tasks: ['build']
      }
    }

  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['browserify']);

};
