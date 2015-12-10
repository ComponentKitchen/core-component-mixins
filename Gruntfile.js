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
        ignore: false, // Don't ignore node_modules; i.e., process them too
        transform: ['babelify']
      },
      dist: {
        files: {
          'dist/core-component-mixins.js': 'src/es5globals.js'
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
          'dist/core-component-mixins.js': 'src/es5globals.js',
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

  grunt.registerTask('default', function() {
    grunt.log.writeln('grunt commands this project supports:\n');
    grunt.log.writeln('  grunt build');
    grunt.log.writeln('  grunt watch');
  });

  grunt.registerTask('build', [
    'browserify:dist',
    'browserify:demos',
    'browserify:test'
  ]);
  grunt.registerTask('watch', ['browserify:watch']);

};
