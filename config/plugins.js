const { DefinePlugin, HotModuleReplacementPlugin } = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const WebpackBar = require("webpackbar");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {
  analyzePath,
  cssFolder,
  faviconPath,
  templatePath,
} = require("./paths");
const { ANALYZE, inDevelopment, NODE_ENV, PORT } = require("./envs");

// =============================================================== //
// WEBPACK PLUGINS                                                 //
// =============================================================== //

/* friendly errors console notes */
const notes = inDevelopment
  ? [`Note that the development build is not optimized.`]
  : [
      `Note that this mode is for development and staging purposes only.`,
      `Please use a suitable server-side solution to serve the build folder.`,
    ];

notes.push(
  `To create a production build, use \x1b[1m\x1b[32myarn build\x1b[0m.\n`,
);

/* common webpack plugins */
const plugins = [
  /* shows a compilation bar instead of the default compile message */
  new WebpackBar({
    color: "#268bd2",
    minimal: false,
    compiledIn: false,
  }),
  /* simplifies creation of HTML files to serve your webpack bundles */
  new HtmlWebpackPlugin({
    template: templatePath,
    favicon: faviconPath,
  }),
  /* in console error */
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: [
        `Your application is running on \x1b[1mhttp://localhost:${PORT}\x1b[0m`,
      ],
      notes,
    },
    clearConsole: true,
  }),
  /* ENVs that'll be defined in the process during build and development run time */
  new DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(NODE_ENV),
      PORT: JSON.stringify(PORT),
    },
  }),
];

/* development webpack plugins */
if (inDevelopment) {
  plugins.push(
    /* in browser error overlay */
    new ErrorOverlayPlugin(),
    /* hot-module plugin to update files without refreshing the page */
    new HotModuleReplacementPlugin(),
  );
} else {
  /* production webpack plugins */
  plugins.push(
    /* extracts CSS to dist folder */
    new MiniCssExtractPlugin({
      filename: cssFolder,
    }),
    /* copies some files from public to dist on build */
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/robots.txt" },
        { from: "public/manifest.json" },
        { from: "public/logo_512.png" },
        { from: "public/logo_192.png" },
      ],
    }),
    /* displays a chunk distribution chart */
    ANALYZE &&
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: analyzePath,
      }),
  );
}

module.exports = plugins.filter(Boolean);
