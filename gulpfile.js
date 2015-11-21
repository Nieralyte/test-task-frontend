// usage: `gulp build` or `gulp build --watch`

'use strict'

var gulp = require('gulp')
var webpack = require('webpack')
var watch = require('gulp-watch')
var livereload = require('gulp-livereload')
var gutil = require('gulp-util')


var webpackConfig = {
  entry: './src/index.js',
  
  output: {
    path: './dist',
    filename: 'index.js',
  },
  
  module: {
    loaders: [
      {test: /\.less$/, loader: 'style!css!less'},
      {test: /\.js$/, loader: 'babel?presets[]=es2015,presets[]=stage-0'},
      {test: /\.tpl$/, loader: 'html?attrs=[]'},
    ],
  },
}


if (gutil.env.watch) {
  livereload.listen()
  gulp.task('build', ['_compile-watch', '_copy-static-assets-watch'])
} else {
  gulp.task('build', ['_compile', '_copy-static-assets'])
}



gulp.task('_compile', function(cb) {
  webpack(webpackConfig, function(err, stats) {
    if (err) cb(new gutil.PluginError('webpack', err))
    else gutil.log('[webpack]', stats.toString()); cb()
  })
})

gulp.task('_copy-static-assets', function() {
  return gulp.src('./src/**/*.!(js|less|tpl)')
    .pipe(gulp.dest('./dist'))
})


gulp.task('_compile-watch', function(cb) {
  var watcherOpts = undefined // all defaults
  
  webpack(webpackConfig).watch(watcherOpts, function(err, stats) {
    if (err) {
      cb(new gutil.PluginError('webpack', err))
    } else {
      gutil.log('[webpack]', stats.toString())
      livereload.reload()
    }
  })
})

gulp.task('_copy-static-assets-watch', function() {
  return gulp.src('./src/**/*.!(js|less|tpl)')
    .pipe(watch('./src/**/*.!(js|less|tpl)'), {read: false})
    .pipe(gulp.dest('./dist'))
    .pipe(livereload())
})
