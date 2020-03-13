const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
// fallback to style-loader in development
const finalCssLoader = !isProduction ?
    "style-loader" : // creates style nodes from JS strings
    MiniCssExtractPlugin.loader;

module.exports = {
    mode: "production",
    entry: {
        app: "./src/js/index.js"
    },
    devServer: {
        contentBase: "./dist",
        // https: true,
        liveReload: true,
        writeToDisk: true
    },
    devtool: "inline-source-map",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    finalCssLoader,
                    "css-loader" // translates CSS into CommonJS
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    finalCssLoader,
                    // translates CSS into CommonJS, interprets @import and @url() and resolves them.
                    {
                        loader: "css-loader",
                        options: {
                            // modules: {
                            //     mode: "local",
                            //     localIdentName: isProduction ? "[name]__[local]___[hash:base64:5]" : "[path][name]__[local]",
                            //     context: path.resolve(__dirname, "src"),
                            //     // camelCase: true,
                            // },
                            importLoaders: 1,
                            sourceMap: !isProduction
                        }
                    },
                    // compiles Sass to CSS, using Node Sass by default
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: !isProduction
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    "file-loader"
                ]
            },
            {
                test: /\.(html)$/,
                use: [
                    "html-loader"
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // extracts our CSS out of the JavaScript bundle into a separate file, essential for production builds.
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: isProduction ? "[name].[hash].css" : "[name].css",
            chunkFilename: isProduction ? "[id].[hash].css" : "[id].css"
        }),
        new HtmlWebpackPlugin({
            title: "Nathaniel Blumberg",
            // filename: "resume.html",
            template: "src/html/index.html",
            xhtml: true
        })
    ],
    resolve: {
        extensions: [ ".js", ".css", ".sass", ".scss" ]
    }
};
