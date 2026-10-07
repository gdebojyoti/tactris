import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import pkg from "./package.json" with { type: "json" };

export default {
  entry: "./src/index.ts",
  output: { publicPath: "auto", clean: true },
  devServer: {
    // Mirrors the routes in vercel.json.
    setupMiddlewares: (middlewares) => [
      (req, res, next) => {
        const { pathname, search } = new URL(req.url, "http://localhost");
        if (pathname === "/") return res.writeHead(307, { Location: "/tactris" + search }).end();
        if (pathname === "/tactris/") return res.writeHead(308, { Location: "/tactris" + search }).end();
        if (pathname === "/tactris") req.url = "/index.html";
        next();
      },
      ...middlewares,
    ],
  },
  resolve: { extensions: [".ts", ".tsx", ".js"] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "esbuild-loader",
        options: { target: "es2022", jsx: "automatic" },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: { postcssOptions: { plugins: ["@tailwindcss/postcss"] } },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: "tactris",
      filename: "remoteEntry.js",
      exposes: { "./Tactris": "./src/ui/Tactris.tsx" },
      shared: {
        react: { singleton: true, requiredVersion: pkg.dependencies.react },
        "react-dom": { singleton: true, requiredVersion: pkg.dependencies["react-dom"] },
      },
    }),
    new HtmlWebpackPlugin({ template: "./src/index.html", chunks: ["main"] }),
  ],
};
