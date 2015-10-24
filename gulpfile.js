var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var ts = require('gulp-typescript');

var src = {
    "js": "src/**/*.js",
    "ts": "src/**/*.ts",
    "html": "templates/**/*",
    textures: "resources/textures/*.jpg",
    maps: "resources/map/*.dnmap",
    sprites: "resources/sprites/*.png"
};

gulp.task("bower-files", function() {
    gulp.src(bowerFiles()).pipe(gulp.dest("app"));
});

gulp.task("templates", function() {
    gulp.src(src.html).pipe(gulp.dest("app/pages"));
});

gulp.task("textures", function() {
    gulp.src(src.textures).pipe(gulp.dest("app/textures"));
});

gulp.task("sprites", function() {
    gulp.src(src.sprites).pipe(gulp.dest("app/sprites"));
});

gulp.task("maps", function() {
    gulp.src(src.maps).pipe(gulp.dest("app/maps"));
});

gulp.task('scripts', function() {
    gulp.src(src.ts)
        .pipe(ts({
            sortOutput: true
        }))
        .pipe(concat('engine.js'))
        .pipe(gulp.dest('app/'));

    gulp.src(src.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/'));
});

gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true,
        port: 8077
    });
});

gulp.task('watch', function () {
    return watch([src.js, src.ts, src.html, src.maps], function() {
        gulp.start('build');
    });
});

gulp.task('build', ['bower-files', 'scripts', 'templates', 'maps', 'textures', 'sprites']);

gulp.task('default', ['build', 'watch', 'connect']);
