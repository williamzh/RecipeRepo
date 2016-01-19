module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
		    dist: {
				options: {
		        	style: 'expanded'
				},
				files: {
					'Styles/main.css': 'Styles/index.scss'
				}
		    }
		},
		watch: {
			sass: {
				files: 'Styles/**/*.scss',
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
};