const path = require("path");

module.exports = {
  cache: {
    type: "filesystem", // Lưu cache vào hệ thống file
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: "thread-loader", // Tận dụng đa luồng
          },
          "@svgr/webpack",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "thread-loader", // Tận dụng đa luồng
          },
          {
            loader: "file-loader",
            options: {
              name: "static/media/[name].[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@image": path.resolve(__dirname, "src/assets/image"),
    },
    extensions: [".js", ".jsx", ".json"], // Giới hạn phần mở rộng
  },
};
