const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
var EncodingPlugin = require('webpack-encoding-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
    return {
        entry: './src/content.js',
        mode: 'development',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist')
        },

        plugins: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    output: {
                        ascii_only: true,
                        beautify: false,
                    }
                }
            }),
            new CopyWebpackPlugin([{
                from: './src/manifest.json',
                to: './'
            }]),
            new EncodingPlugin({
                encoding: 'UTF-8'
            })
        ]
    }
};