import { CreateCommandOptions } from "../../types";
import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "./package-json";

const buildPackageList = <T extends CreateCommandOptions>({
  qualityTools,
  testFramework,
  buildTool,
  targets,
}: T): string[] => {
  return [
    "@templ-project/create-node",
    "@commitlint/cli",
    "@commitlint/config-conventional",
    "core-js",
    "cross-env",
    "globby",
    "husky",
    "nodemon",
    "npm-run-all2",
    "nyc",
    "release-it",
    "release-please",
    "rimraf",
    // quality tools
    ...(qualityTools.includes("dependency-cruiser")
      ? ["dependency-cruiser"]
      : []),
    ...(qualityTools.includes("eslint")
      ? ["eslint", "eslint-plugin-sonar", "eslint-plugin-sonarjs"]
      : []),
    ...(qualityTools.includes("jscpd")
      ? ["jscpd", "@jscpd/badge-reporter"]
      : []),
    ...(qualityTools.includes("license-checker") ? ["license-checker"] : []),
    ...(qualityTools.includes("oxlint") ? ["oxlint"] : []),
    ...(qualityTools.includes("prettier")
      ? [
          "import-sort-style-module",
          "prettier",
          "prettier-plugin-import-sort",
          ...(qualityTools.includes("eslint")
            ? [
                "eslint-config-prettier",
                "eslint-plugin-import",
                "eslint-plugin-prettier",
              ]
            : []),
        ]
      : []),
    // test frameworks
    ...(testFramework.includes("ava")
      ? [
          "ava",
          "sinon",
          ...(qualityTools.includes("eslint") ? ["eslint-plugin-ava"] : []),
        ]
      : []),
    ...(testFramework.includes("jasmine") ? ["jasmine", "sinon"] : []),
    ...(testFramework.includes("jest")
      ? [
          "jest",
          ...(qualityTools.includes("eslint") ? ["eslint-plugin-jest"] : []),
        ]
      : []),
    ...(testFramework.includes("mocha")
      ? [
          "chai",
          "mocha",
          "sinon",
          ...(qualityTools.includes("eslint") ? ["eslint-plugin-mocha"] : []),
        ]
      : []),
    ...(testFramework.includes("vitest") ? ["vitest"] : []),
    // languages specific
    // ...(language === "coffee" ? [] : []),
    // ...(language === "ts"
    //   ? [
    //       "typescript",
    //       "ts-node",
    //       "tslib",
    //       "@types/node",
    //       "@istanbuljs/nyc-config-typescript",
    //       ...(testFramework.includes("eslint")
    //         ? ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"]
    //         : []),
    //       ...(testFramework.includes("jest") ? ["ts-jest", "@types/jest"] : []),
    //       ...(testFramework.includes("mocha") ? ["@types/chai", "@types/mocha"] : []),
    //     ]
    //   : []),
    // builder specific
    ...(buildTool === "esbuild" ||
    targets?.includes("browser") ||
    targets?.includes("deno")
      ? ["esbuild"]
      : []),
    ...(buildTool === "rollup" ||
    targets?.includes("browser") ||
    targets?.includes("deno")
      ? ["rollup"]
      : []),
    ...(buildTool === "rollup"
      ? ["@rollup/plugin-commonjs", "@rollup/plugin-node-resolve"]
      : []),
    ...(buildTool === "swc" ? ["@swc/cli", "@swc/core", "browserslist"] : []),
  ];
};

export default async function <T extends CreateCommandOptions>(
  options: T
): Promise<void> {
  const { packageManager, logger } = options;
  logger?.verbose("installing default dependencies...");

  const { install: pmInstall } = await import(
    `../../util/package-manager/${packageManager}`
  );
  await pmInstall(buildPackageList(options), {
    ...options,
    saveDev: true,
  });

  return updatePackageJson(options, (packageObject: PackageJsonOptions) => ({
    ...packageObject,
    scripts: {
      ...(packageObject as any).scripts,
      clean: "rimraf ./dist",
      prepare: "husky",
      release: "run-s release:*",
      "release:release-it": "release-it --ci --no-npm.publish",
      "release:release-please": "release-please",
    },
  }));
}