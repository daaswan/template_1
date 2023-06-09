/*eslint-env node */

var del = require('del');
var pump = require('pump')
var path = require('path');

var gulp = require('gulp');
var merge = require('merge-stream');

var htmlmin = require('gulp-htmlmin');

var sass = require('gulp-sass')(require('sass'));
var autoprefixer = require('gulp-autoprefixer');
var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem')
var uncss = require('postcss-uncss');
var cssnano = require('cssnano');

var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglifyjs = require('gulp-terser');
var sourcemaps = require('gulp-sourcemaps');

var jasmine = require('gulp-jasmine-phantom');

var imageOptimizer = require('gulp-image-optimization');

var browserSync = require('browser-sync').create();


var paths = {
	src: 'src',
	srcHTML: 'src/*.html',
	srcSCSS: 'src/sass/*.scss',
	srcCSS: 'src/css/',
	srcJS: 'src/js/',
	srcImg: 'src/img/*.*',

	dist: 'dist',
	distHTML: 'dist/',
	distCSS: 'dist/css/',
	distJS: 'dist/js/',
	distImg: 'dist/img/',
};


var externalSCSS = [
	paths.srcSCSS
]


var externalJS = [
	'node_modules/jquery/dist/jquery.min.js',
	'node_modules/popper.js/dist/popper.min.js',
	'node_modules/bootstrap/dist/js/bootstrap.min.js',
	'node_modules/chart.js/dist/Chart.min.js',
	'node_modules/owl.carousel/dist/owl.carousel.min.js'
]


gulp.task('default', ['dev']);


gulp.task('dev', [
	'html-dev',
	'styles-dev',
	'lint-dev',
	'scripts-dev',
	'watch-dev',
	'serve'
]);

gulp.task('dist', [
	'clean',
	'html-dist',
	'styles-dist',
	'scripts-dist'
	/*,
	'images-dist' */
]);

gulp.task('clean', function () {
	del.sync([paths.dist + '/**']);
});



/**
 * Development related tasks
 */




gulp.task('html-dev', function () {
	gulp.src(paths.srcHTML)
		.pipe(browserSync.stream());
});


gulp.task('styles-dev', function () {
	gulp.src(externalSCSS)
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: [
				'node_modules/bootstrap/scss/',
				'node_modules/font-awesome/scss/',
				'node_modules/sass-rem/'
			]
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest(paths.srcCSS))
		.pipe(browserSync.stream());
});


gulp.task('lint-dev', function () {
	return gulp.src([paths.srcJS, '!node_modules/**'])
		// eslint() attaches the lint output to the eslint property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});


gulp.task('scripts-dev', function () {
	gulp.src(externalJS)
		.pipe(gulp.dest(paths.srcJS));

	gulp.src(paths.srcJS)
		.pipe(browserSync.stream());
});


gulp.task('watch-dev', function () {
	var scssWatcher = gulp.watch(paths.srcSCSS, ['styles-dev']);
	scssWatcher
		.on('change', function (event) {
			fileDeleteHandle(event)
		});

	var jsWatcher = gulp.watch(paths.srcJS, ['lint-dev', 'scripts-dev']);
	jsWatcher
		.on('change', function (event) {
			fileDeleteHandle(event)
		});

	var htmlWatcher = gulp.watch(paths.srcHTML, ['html-dev']);
	htmlWatcher
		.on('change', function (event) {
			fileDeleteHandle(event)
		});
});


gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: paths.src
		}
	});
});


function fileDeleteHandle(event) {
	if (event.type === 'deleted') {
		// Simulating the {base: 'src'} used with gulp.src in the scripts task
		var filePathFromSrc = path.relative(path.resolve(paths.src), event.path);

		// Concatenating the 'dist' absolute path used by gulp.dest in the scripts task
		var destFilePath = path.resolve(paths.dist, filePathFromSrc);

		del.sync(destFilePath);
	}
}


/**
 * Distribution related tasks
 */


gulp.task('html-dist', function () {
	gulp.src(paths.srcHTML)
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(paths.distHTML));
});


gulp.task('styles-dist', function () {
	var processors = [
		autoprefixer,
		cssnano,
		// uncss({
		// 	html: paths.srcHTML
		// }),
		pxtorem({
			replace: false
		})
	];

	var sassStream = gulp.src(externalSCSS)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed',
			includePaths: [
				'node_modules/bootstrap/scss/',
				'node_modules/font-awesome/scss/',
				'node_modules/sass-rem/'
			]
		}).on('error', sass.logError));

	var cssStream = gulp.src('css/*.css');

	merge(sassStream, cssStream).pipe(concat('styles.css'))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.distCSS));
});


gulp.task('scripts-dist', function (cb) {
	pump([
			gulp.src(externalJS),
			sourcemaps.init({
				loadMaps: true
			}),
			concat('script.js'),
			uglifyjs({
				compress: {
					drop_console: true,
					drop_debugger: true
				}
			}),
			sourcemaps.write('./'),
			gulp.dest(paths.distJS)
		],
		cb
	);
});


gulp.task('images-dist', function (cb) {
	gulp.src(['src/img/*.png', 'src/img/*.jpg', 'src/img/*.gif', 'src/img/*.jpeg']).pipe(imageOptimizer({
		optimizationLevel: 5,
		progressive: true,
		interlaced: true
	})).pipe(gulp.dest(paths.distImg)).on('end', cb).on('error', cb);
});


gulp.task('serve-dist', function () {
	browserSync.init({
		server: {
			baseDir: paths.dist
		}
	});
});



/**
 * Test related tasks
 */



gulp.task('tests', function () {
	gulp.src('tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: paths.srcJS
		}));
});