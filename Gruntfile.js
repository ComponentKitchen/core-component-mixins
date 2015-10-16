module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-browserify');

  // Project configuration.
  grunt.initConfig({

    browserify: {
      options: {
        transform: [['babelify']]
      },
      dist: {
        files: {
          'build/demos.js': 'demos/GreetElement.js'
        }
      },
      test: {
        files: {
          'build/tests.js': 'test/ElementBase.tests.js'
        }
      }
    }

  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['browserify']);
};
