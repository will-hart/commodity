var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var eslint = require("gulp-eslint");
var watch = require("gulp-watch");
var mocha = require("gulp-mocha");
var plumber = require("gulp-plumber");
var surge = require("gulp-surge");
require("babel-core/register");

gulp.task("default", function () {
  return gulp.src("src/**/*.js")
    .pipe(plumber())

    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())

    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))

    .pipe(gulp.dest("dist"));
});

gulp.task("test", function() {
  return gulp.src("test/*.js")
    .pipe(mocha());
});

gulp.task("devbuild", function() {
  gulp.start("test", "default");
});

gulp.task("deploy", function() {
  return surge({
    project: './dist'
  });
});

gulp.task("watch", function() {
    gulp.watch(["src/**/*.js", "test/*.js"], ["devbuild"]);
});
