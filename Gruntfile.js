module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-browserify');

  // Project configuration.
  grunt.initConfig({

    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        transform: ['babelify']
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
      },
      watch: {
        files: {
          'build/demos.js': ['demos/*.js', 'demos/**/*.js'],
          'build/tests.js': 'test/*.tests.js'
        },
        options: {
          keepAlive: true,
          watch: true
        }
      }
    }

  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', [
    'browserify:dist',
    'browserify:demos',
    'browserify:test'
  ]);
  grunt.registerTask('watch', ['browserify:watch']);

};
