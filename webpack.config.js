const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
var EncodingPlugin = require('webpack-encoding-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {
    return [
    {
        name: 'main',
        entry: './src/content.js',
        mode: "development",
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist')
        },

        plugins: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    compressor: {
                        compress: {
                          warnings: false
                        }
                    },
                    output: {
                        ascii_only: true,
                        beautify: false,
                    }
                }
            }),
            new CopyWebpackPlugin([
                {
                    from: './src/manifest.json',
                    to: './'
                },
                {
                    from: './src/background.js',
                    to: './'
                }
            ]),
            new EncodingPlugin({
                encoding: 'UTF-8'
            })
        ]
    },
    {
        name: 'popup',
        entry: './src/popup.js',
        mode: env.prod ? "production" : "development",
        output: {
            filename: 'popup.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'popup.html',
                template: './src/popup.html'
            })
        ]

    }
]};