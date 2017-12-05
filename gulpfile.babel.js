import gulp from 'gulp';
import gutil from 'gulp-util';
import webserver from 'gulp-webserver';
import sass from 'gulp-sass';
import open from 'gulp-open';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import sync from 'browser-sync';
import webpack from 'webpack-stream';

const PORT = 3000;
const BROWSER_SYNC_PORT = 7000;

const DIR = {
    SRC: 'src',
    BUILD: 'build'
};

const INDEX = {
    JS: 'index.js'
};

const SRC = {
    JS: DIR.SRC + '/**/*.js',
    CSS: DIR.SRC + '/**/*.css',
    SCSS: DIR.SRC + '/**/*.scss',
    HTML: DIR.SRC + '/*.html',
    IMAGES: DIR.SRC + '/images/*'
};

gulp.task('css', () =>
    gulp.src(SRC.CSS)
        .pipe(gulp.dest(DIR.BUILD))
);

gulp.task('sass', () =>
    gulp.src(SRC.SCSS)
        .pipe(sass())
        .pipe(gulp.dest(DIR.BUILD))
);

gulp.task('html', () =>
    gulp.src(SRC.HTML)
        .pipe(gulp.dest(DIR.BUILD))
);

gulp.task('webpack', () => 
    gulp.src(DIR.SRC + '/' + INDEX.JS)
        .pipe(webpack({
            output: {
                filename: INDEX.JS
            },
            devtool: 'source-map'
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./', {sourceRoot: '../' + DIR.SRC}))
        .pipe(gulp.dest(DIR.BUILD))
);

gulp.task('clean', () => del.sync([DIR.BUILD]));

gulp.task('build', ['clean', 'webpack', 'sass', 'css', 'html'], () => {
    gutil.log('Build Complete');
});

gulp.task('watch', () => {
    gulp.watch(SRC.JS, ['webpack']);
    gulp.watch(SRC.CSS, ['css']);
    gulp.watch(SRC.SCSS, ['sass']);
    gulp.watch(SRC.HTML, ['html']);
    gulp.watch(SRC.IMAGES, ['images']);
});

gulp.task('browser-sync', () => {
    sync.init(null, {
        proxy: "http://localhost:" + PORT,
        files: [ DIR.BUILD + "/**/*.*"],
        port: BROWSER_SYNC_PORT
    })
});

gulp.task('serve', ['build', 'watch', 'browser-sync'], () => 
    gulp.src(DIR.BUILD)
        .pipe(webserver({
            port: PORT,
            livereload: true,
            open: true,
            proxies: [
            ]
        }))
        .pipe(open({
            uri: 'http://localhost:' + PORT
        }))
);