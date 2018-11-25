const path = require('path');

const webpack = require('webpack');

const MODE = process.env.MODE || 'development';

let config = {
	mode: MODE,
	entry: {
		app: path.join(__dirname, 'src', 'app.js')
	},
	output: {
		//filename: '[name]_[contenthash].js',
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),

		publicPath: 'http://localhost:9000/'
	},

	resolve: {
		alias: {
		},
		extensions: ['.js'],
	},

	module: {
		rules: (() => {
			let rules = [
				{
					test: /\.(png|svg)$/,
					use: {
						loader: 'file-loader',
						options: {
							name: 'files/[path][name].[ext]',
						},
					},
				},
				{
					test: /\.less$/,
					use: ['style-loader', 'css-loader', 'less-loader'],
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
			];

			return rules;
		})()
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /\/node_modules\//,
					name: 'vendor',
					chunks: 'all'
				}
			}
		}
	},

	plugins: [new webpack.HotModuleReplacementPlugin()],

	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 9000,

		hotOnly: true,

		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		}
	}
};

module.exports = config;