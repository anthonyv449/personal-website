module.exports = {
    entry: "./host/src/index.js", // Ensure this is the correct path
    mode: "development",
    output: {
      filename: "bundle.js",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".jsx"], // Allow .js and .jsx extensions
    },
    module: {
      rules: [
        {
            test: /\.(js|jsx)$/, // Match .js and .jsx files
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/preset-react"], // Ensure React preset is included
              },
            },
          },
          {
            test: /\.css$/, // For CSS files
            use: ["style-loader", "css-loader"],
          },
      ],
    },
    devServer: {
      static: "./public",
      port: 3000,
      historyApiFallback: true, // For React Router support
    },
  };
  