const path = require('path');

module.exports = {
	entry: {
		index: './src/frontend.js',
	},
	output: {
		filename: 'MMM-AusFireIncidents.js',
		path: path.resolve(__dirname),
	},
	module: {
		rules: [
			{
				test: /\.handlebars$/, // Handlebars template files
				loader: 'handlebars-loader',
			},
		],
	},
};
