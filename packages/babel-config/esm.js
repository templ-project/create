// .babelrc.js

module.exports = {
  ...require("./base"),
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        corejs: 3,
        forceAllTransforms: true,
        modules: false,
        targets: { esmodules: true },
        useBuiltIns: "usage",
      },
    ],
  ],
};
