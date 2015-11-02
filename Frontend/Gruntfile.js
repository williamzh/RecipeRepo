module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			options: {
				mangle: false,
				beautify: true
			},
			dist: {
				files: {
					'dist/app/lib.min.js': [
						'bower_components/jquery/dist/jquery.js',
						'bower_components/sugar/release/sugar-full.development.js',
						'bower_components/angular/angular.js',
						'bower_components/angular-mocks/angular-mocks.js',
						'bower_components/angular-ui-router/release/angular-ui-router.js',
						'bower_components/ngstorage/ngStorage.js',
						'assets/lib/*.js'
					],
					'dist/app/app.min.js': ['app/**/*.js']
				}
			}
		},
		copy: {
			main: {
				files: [
					{ 
						expand: true, 
						src: ['assets/css/fonts/**'],
						dest: 'dist/fonts',
						flatten: true,
						filter: 'isFile'
					},
					{
						expand: true,
						src: ['assets/img/**/*'],
						dest: 'dist/img',
						flatten: true
					},
					{
						expand: true,
						src: ['app/**/*.html', 'index.html'],
						dest: 'dist'
					}
				],
			},
		},
		clean: ["dist/**/*"],
		sass: {
		    dist: {
				options: {
		        	style: 'expanded',
		        	sourcemap: 'none'
				},
				files: {
					'dist/css/lib.min.css': 'assets/css/lib/**/*.css',
					'dist/css/style.min.css': 'assets/css/sass/style.scss',
				}
		    }
		},
		watch: {
			sass: {
				files: 'assets/**/*.scss',
				tasks: ['sass']
			},
			// js: {
			// 	files: 'app/**/*.js',
			// 	tasks: ['uglify']
			// }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['clean', 'uglify', 'sass', 'copy']);
};