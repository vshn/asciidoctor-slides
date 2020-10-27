const gulp = require('gulp')
const ts = require('gulp-typescript')
const uglify = require('gulp-uglify')
const chmod = require('gulp-chmod')
const insert = require('gulp-insert')
const tsProject = ts.createProject('tsconfig.json')

function build() {
  return tsProject.src()
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
}

function release() {
  return gulp.src('dist/asciidoctor-slides.js')
    .pipe(insert.prepend('#!/usr/bin/env node\n'))
    .pipe(chmod(0o755))
    .pipe(gulp.dest('dist'))
}

exports.default = gulp.series(build, release)
