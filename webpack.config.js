const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // Entry point of the application
  entry: "./src/index.js",

  // Output directory and file name
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true, // Clean the output directory before emit
  },

  // Development server configuration
  devServer: {
    static: "./dist",
    hot: true,
  },

  // Module rules for handling different file types
  module: {
    rules: [
      {
        test: /\.js$/, // Handling JavaScript files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"], // Preset used for JSX
          },
        },
      },
      {
        test: /\.css$/, // Handling CSS files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i, // Handling image files
        type: "asset/resource",
      },
    ],
  },

  // Plugins used in the build process
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // HTML template file
    }),
  ],

  // Resolve configurations including fallback for Node.js core modules
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"), // Providing a fallback for 'path' module
    },
  },

  // Optimizations like code splitting
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
