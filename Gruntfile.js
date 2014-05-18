// Gruntfile.js

module.exports = function(grunt) {

	// Example configuration
	grunt.initConfig({
	  jasmine: {
	    pivotal: {
	      src: 'src/**/*.js',
	      options: {
	        specs: 'tests/spec/*Spec.js',
	        helpers: 'tests/spec/*Helper.js',
	        keepRunner: true,
	        outfile: 'tests/_SpecRunner.html'
	      }
	    }
	  }, watch: {
		scripts: {
		  files: ['src/**/*.js', 'tests/spec/*.js'],
		  tasks: ['jasmine'],
		  options: {
		    spawn: false,
		    livereload: true
		  },
		},
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');

	//grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-nodeunit');
	/*grunt.loadNpmTasks('grunt-contrib-internal');
	grunt.loadNpmTasks('grunt-contrib-connect');*/

	//grunt.registerTask('test', ['connect:return500', 'jasmine', 'nodeunit']);
    //grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);

};