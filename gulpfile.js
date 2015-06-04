var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var ghPages = require("gulp-gh-pages");

gulp.task("default", function(/*callback*/) {

  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

  new WebpackDevServer(webpack(myConfig), {
    publicPath: "/" + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, "localhost", function(err) {
    if (err) {
      throw new gutil.PluginError("webpack-dev-server", err);
    }
    // Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

    // keep the server alive or continue?
    // callback();
  });

});

gulp.task("copy-assets", function() {
  return gulp.src("./index.html").pipe(gulp.dest("./dist"));
});

gulp.task("build", ["copy-assets"], function(callback) {
  var myConfig = Object.create(webpackConfig);

  myConfig.plugins = myConfig.plugins.concat([
    new webpack.DefinePlugin({
      // This has effect on the react lib size.
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin("Generated on " + (new Date()), { raw: false })
  ]);

  webpack(myConfig).run(function(error, stats) {
    if (error) {
      return callback(error);
    }
    gutil.log("[webpack-build]", stats.toString({ colors: true }));
    callback();
  });

});

gulp.task("deploy", ["build"], function() {
  return gulp.src("./dist/**/*").pipe(ghPages());
});
