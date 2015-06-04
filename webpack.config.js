var path = require("path");
var webpack = require("webpack");

module.exports = {
	cache: true,
	entry: [
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/only-dev-server",
    "./app/router"
  ],
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "dist/",
		filename: "bundle.js",
		chunkFilename: "[chunkhash].js"
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: path.join(__dirname, "app"),
				loaders: ["react-hot", "babel-loader?optional[]=runtime"]
			}
		]
	},
	resolve: {
		extensions: ["", ".js", ".jsx"]
	},
	plugins: [
    new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
      "es6-promise": "es6-promise",
			"fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch"
    }),
    new webpack.NoErrorsPlugin()
  ]
};
