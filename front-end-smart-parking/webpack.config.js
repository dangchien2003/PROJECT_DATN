const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[hash][ext]",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@image": path.resolve(__dirname, "src/assets/image"),
    },
  },
};
