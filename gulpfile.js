
const gulp = require('gulp')
const rename = require('gulp-rename')
const del = require('del')

const through = require('through2')
const colors = require('ansi-colors')
const log = require('fancy-log')
const argv = require('minimist')(process.argv.slice(2))

const postcss = require('gulp-postcss')
const pxtorpx = require('postcss-px2rpx')
const base64 = require('postcss-font-base64')

const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const jsonminify = require('gulp-jsonminify')
const combiner = require('stream-combiner2')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const cssnano = require('gulp-cssnano')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const filter = require('gulp-filter')
const jdists = require('gulp-jdists')

const src = './client'
const dist = './dist'
const isProd = argv.type === 'prod'

const handleError = (error) => {
  console.log('\n')
  log(colors.red('Error!'))
  log('fileName: ' + colors.red(error.fileName))
  log('lineNumber: ' + colors.red(error.lineNumber))
  log('message: ' + error.message)
  log('plugin: ' + colors.yellow(error.plugin))
}

gulp.task('json', function () {
  return gulp.src(`${src}/**/*.json`)
    .pipe(isProd ? jsonminify() : through.obj())
    .pipe(gulp.dest(dist))
})

gulp.task('wxml', function () {
  return gulp.src(`${src}/**/*.wxml`)
    .pipe(gulp.dest(dist))
})

gulp.task('wxs', function () {
  return gulp.src(`${src}/**/*.wxs`)
    .pipe(gulp.dest(dist))
})

gulp.task('wxss', function () {
  const combined = combiner.obj([
    gulp.src(`${src}/**/*.{wxss,scss}`),
    sass().on('error', sass.logError),
    postcss([pxtorpx(), base64()]),
    isProd
      ? cssnano({
        autoprefixer: false,
        discardComments: { removeAll: true }
      })
      : through.obj(),
    rename((path) => (path.extname = '.wxss')),
    gulp.dest(dist)
  ])

  combined.on('error', handleError)
})

gulp.task('images', function () {
  return gulp.src(`${src}/images/**`)
    .pipe(gulp.dest(`${dist}/images`))
})

gulp.task('js', function () {
  const f = filter((file) => !/(mock)/.test(file.path)) // TODO: 这段代码作用是什么？
  gulp.src(`${src}/**/*.js`)
    .pipe(isProd ? f : through.obj())
    .pipe(
      isProd
        ? jdists({ trigger: 'prod' })
        : jdists({ trigger: 'dev' })
    )
    .pipe(isProd ? through.obj() : sourcemaps.init())
    .pipe(
      babel({
        presets: ['env'] // TODO: 搞懂babel配置
      })
    )
    .pipe(
      isProd
        ? uglify({ compress: true })
        : through.obj()
    )
    .pipe(isProd ? through.obj() : sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
})

gulp.task('watch', function () {
  ;['wxml', 'wxss', 'js', 'json', 'wxs'].forEach((value) => {
    gulp.watch(`${src}/**/*.${value}`, [value])
  })
  gulp.watch(`${src}/images/**`, ['images'])
  gulp.watch(`${src}/**/*.scss`, ['wxss'])
})

gulp.task('clean', function () {
  return del(['./dist/**'])
})

gulp.task('dev', ['clean'], function () {
  runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'cloud', 'watch')
})

gulp.task('build', ['clean'], function () {
  runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'cloud')
})

// cloud-functions 处理
const cloudPath = './server/cloud-functions'
gulp.task('cloud', function () {
  return gulp.src(`${cloudPath}/**`)
    .pipe(
      isProd
        ? jdists({ trigger: 'prod' })
        : jdists({ trigger: 'dev' })
    )
    .pipe(gulp.dest(`${dist}/cloud-functions`))
})

gulp.task('watch:cloud', function () {
  gulp.watch(`${cloudPath}/**`, ['cloud'])
})

gulp.task('cloud:dev', function () {
  runSequence('cloud', 'watch:cloud')
})
