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
	  },
	  

	  watch: {

	  	/**
		 * Watch source files, spec files, the express server, and the express server.js. When
		 * one file is changed, rerun terminal tests and livereload SpecRunner.
		 */
		scripts: {
		  files: ['src/**/*.js', 'tests/spec/*.js'],//, 'tests/express-server/**/*.js', 'tests/server.js'],
		  //tasks: ['jasmine'],
		  options: {
		    spawn: false,  // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
		  	livereload: true
		  }
		},

		terminal: {
		  files: ['src/**/*.js', 'tests/spec/*.js'],//, 'tests/express-server/**/*.js', 'tests/server.js'],
		  tasks: ['jasmine'],
		  options: {
		    spawn: false  // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
		  }
		},
		
		/**
		 * Watch for express server changes and restart if needed.
		 */	
	    express: {
	      files:  [ 'tests/express-test-server/**/*.js' ],
	      tasks:  [ 'express:test', 'jasmine' ],
	      options: {
	        spawn: false,  // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
	      	livereload: 35730
	      }
	    }

	  },

	  /**
	   * Run 'grunt express:dev' to run express server outside of grunt watch.
	   */
	  express: {
	    options: {
	      // Override defaults here
	      background: true
	    },
	    dev: {
	      options: {
	        script: 'tests/express-test-server/server.js',
	        background: false
	      }
	    },
	    prod: {
	      options: {
	        script: 'path/to/prod/server.js',
	        node_env: 'production'
	      }
	    },

	    /**
	     * Runs express in the background. Used with 'grunt test'
	     */
	    test: {
	      options: {
	        script: 'tests/express-test-server/server.js'
	      }
	    }
	  },

	  /**
	   * Run static http-server to load the Jasmine SpecRunner.html at 
	   * http://localhost:8090/tests/_SpecRunner.html
	   */
	  'http-server': {

	  	/**
	  	 * Use 'grunt http-server:dev' to run the static http-server independently
	  	 */
        'dev': {

            // the server root directory
            root: '.',

            port: 8090,

            host: "127.0.0.1",

            cache: 0,
            showDir : true,
            autoIndex: true,
            defaultExt: "html",

            // run in parallel with other tasks
            runInBackground: false

        },

        /**
	     * Runs http-server in the background. Used with 'grunt test'
	     */
        'test': {

            // the server root directory
            root: '.',

            port: 8090,            

            host: "127.0.0.1",

            cache: 0,
            showDir : true,
            autoIndex: true,
            defaultExt: "html",

            // run in parallel with other tasks
            runInBackground: true

        }
      }
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-http-server');
	

    /**
     * Run 'grunt watch:all' to run tests, start servers, and watch for changes.
     */
    grunt.registerTask('watch:all', 'Run terminal tests, start express, http server, and watch changes', function(arg1) {
     	grunt.task.run("express:test");
     	grunt.task.run("jasmine");    
        grunt.task.run("http-server:test");
        grunt.task.run("watch");
    });


    /**
     * Run 'grunt test' to run Jasmine tests from terminal with express running then shutdown.
     */
    grunt.registerTask('test', 'Start express and run terminal tests', function(arg1) {
        grunt.task.run("express:test");
        grunt.task.run("jasmine");
    });


    /**
     * Watch for changes to express, the source, and specs, but without the overhead of waiting for
     * tests on the terminal to rerun each time.
     */
    grunt.registerTask('watch:browser', function() {
	    // Configuration for watch:test tasks.
	    var config = {
	      options: {
	      	livereload: true
	      },
	      scripts: {
			files: ['src/**/*.js', 'tests/spec/*.js'],
			options: {
			  spawn: false  // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
			}
		  },

		  /**
		   * Watch for express server changes and restart if needed.
		   */	
		  express: {
		    files:  [ 'tests/express-test-server/**/*.js' ],
		    tasks:  [ 'express:test', 'jasmine' ],
		    options: {
		      spawn: false  // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
		    }
		  }

	    };

	    grunt.task.run("express:test");
        grunt.task.run("http-server:test");
	    grunt.config('watch', config);
	    grunt.task.run('watch');
	});


     //grunt.loadNpmTasks('grunt-contrib-nodeunit');
	/*grunt.loadNpmTasks('grunt-contrib-internal');
	grunt.loadNpmTasks('grunt-contrib-connect');*/
	//grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.registerTask('test', ['connect:return500', 'jasmine', 'nodeunit']);
    //grunt.registerTask('default', ['jshint', 'test', 'build-contrib']);

};