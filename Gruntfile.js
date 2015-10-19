module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({

    browserify: {
      options: {
        transform: [['babelify']]
      },
      dist: {
        files: {
          'dist/ElementBase.js': 'src/ElementBase.js'
        }
      },
      demos: {
        files: {
          'build/demos.js': 'demos/GreetElement.js'
        }
      },
      test: {
        files: {
          'build/tests.js': 'test/ElementBase.tests.js'
        }
      }
    },

    watch: {
      scripts: {
        files: ['demos/*.js', 'src/*.js', 'test/*.js'],
        tasks: ['build']
      }
    }

  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['browserify']);

};