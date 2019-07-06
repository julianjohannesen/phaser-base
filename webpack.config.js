const HTMLWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {

    module: {
        rules: [
            {
                test: /.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true }
                }]
            },

            {
                test: /.css$/,
                use: [
                    {
                        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
                
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },

    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            filename: './index.html'
        }),
        // New plugin
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        })
    ],

}