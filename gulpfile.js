const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config.js');
const ghPages = require('gulp-gh-pages');

gulp.task('default', (/* callback */) => {
  // modify some webpack config options
  const myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  new WebpackDevServer(webpack(myConfig), {
    publicPath: `/${myConfig.output.publicPath}`,
    stats: {
      colors: true,
    },
  }).listen(8080, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    // Server listening
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');

    // keep the server alive or continue?
    // callback();
  });
});

gulp.task('copy-assets', () => gulp.src('./index.html').pipe(gulp.dest('./dist')));

gulp.task('build', ['copy-assets'], (callback) => {
  const myConfig = Object.create(webpackConfig);

  myConfig.devtool = 'hidden-source-map';
  myConfig.entry = ['./app/router'];

  myConfig.plugins = myConfig.plugins.concat([
    new webpack.DefinePlugin({
      // This has effect on the react lib size.
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(`Generated on ${(new Date())}`, { raw: false }),
  ]);

  webpack(myConfig).run((error, stats) => {
    if (error) {
      return callback(error);
    }
    gutil.log('[webpack-build]', stats.toString({ colors: true }));
    callback();
  });
});

gulp.task('deploy', ['build'], () => gulp.src('./dist/**/*').pipe(ghPages()));
