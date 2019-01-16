const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "public/index_admin.html"),
    filename: "./index.html"
});
module.exports = {
    entry: {
        admin: path.join(__dirname, "public/index_admin.js"),
        visitor: path.join(__dirname, "public/index_visitor.js")
      },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        inject: false,
        chunks: ['admin'],
        template: path.join(__dirname, "public/index_admin.html"),
        filename: 'index_admin.html'
      }),
      new HtmlWebpackPlugin({
        inject: false,
        chunks: ['visitor'],
        template: path.join(__dirname, "public/index_visitor.html"),
        filename: 'index_visitor.html'
      })],
    resolve: {
        extensions: [".js", ".jsx"]
    },
    devServer: {
        port: 3001
    }
};