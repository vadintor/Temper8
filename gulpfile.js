const gulp = require('gulp');
const log = require('fancy-log');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const tsProject = typescript.createProject('tsconfig.json');
const tsBrowser = typescript.createProject('tsconfig.browser.json');
const srcGlobs = tsProject.config.include;
const publicGlobs = ["src/public/**/*"];

// Compile the TS sources
gulp.task('typescript', () => {
    tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject()).on('error', log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tsProject.options.outDir));
});
// Compile for browser

// Copy any pre-defined declarations
gulp.task('copydecl', () => {
    const decDirs = [];
    srcGlobs.forEach((dir) => {
        decDirs.push(`${dir.split('/')[0]}/**/*.d.ts`);
    });
    gulp.src(decDirs)
        .pipe(gulp.dest(tsProject.options.declarationDir));
});

// Copy any other files
gulp.task('copyfiles', () => {
    gulp.src('src/views/*.pug')
        .pipe(gulp.dest(tsProject.options.outDir.concat('/views/')));
    const publicDirs = [];
    publicGlobs.forEach(dir => {
        publicDirs.push(`${dir.split('/')[0]}/**/*.css`);
        publicDirs.push(`${dir.split('/')[0]}/**/*.html`);
        publicDirs.push(`${dir.split('/')[0]}/**/*.png`);
        publicDirs.push(`${dir.split('/')[0]}/**/*.jpg`);
        publicDirs.push(`${dir.split('/')[0]}/**/*.ico`);
    })
    gulp.src(publicDirs)
        .pipe(gulp.dest(tsProject.options.outDir));
});

gulp.task('browser', () => {
    tsBrowser.src()
        .pipe(sourcemaps.init())
        .pipe(tsBrowser()).on('error', log)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tsBrowser.options.outDir));
});

gulp.task('watch', () => {
    watch(srcGlobs, () => {
        gulp.start('build');
    });
});

gulp.task('build', ['typescript', 'copydecl', 'copyfiles', 'browser']);