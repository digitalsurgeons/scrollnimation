
import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import eslint from 'gulp-eslint';
import rimraf from 'gulp-rimraf';
import runSequence from 'run-sequence';

var config = {
  paths: {
    js: {
      src: 'src/**/*.js',
      dist: 'dist/'
    }
  }
};

gulp.task('clean', () =>
  gulp.src([config.paths.js.dist])
    .pipe(rimraf({ force: true }))
);

gulp.task('babel', ['babel-src']);

gulp.task('babel-src', ['lint-src'], () =>
  gulp.src(config.paths.js.src)
    .pipe(babel())
    .pipe(gulp.dest(config.paths.js.dist))
);

gulp.task('lint-src', () =>
  gulp.src(config.paths.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
);

gulp.task('watch', () => {
  gulp.watch(config.paths.js.src, ['babel-src']);
});

// Default Task
gulp.task('default', () =>
  runSequence('clean', ['babel'])
);