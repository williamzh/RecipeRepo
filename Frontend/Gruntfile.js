module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
		    dist: {
				options: {
		        	style: 'expanded'
				},
				files: {
					'app/css/style.css': 'app/sass/style.scss',
				}
		    }
		},
		watch: {
			sass: {
				files: '**/*.scss',
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
};