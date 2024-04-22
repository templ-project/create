import readRepoFile from "../../util/read-repo-file";

import { update as updatePackageJson } from "../../default/create/package-json";
import rollup from "../../default/build-tool/rollup";
import writeFile from "../../util/write-file";
import { BuildTarget, CreateCommandOptions } from "../../types";

export default async function (options: CreateCommandOptions) {
  const { targets, logger, buildTool } = options;
  logger?.verbose(`configuring (typescript) ${buildTool}...`);

  await rollup(options);

  const rollupConfig = await readRepoFile(
    "../ts/static/rollup.config.js",
    options
  );
  await writeFile("rollup.config.js", rollupConfig, options);

  return updatePackageJson(options, (packageObject) => ({
    ...packageObject,
    scripts: {
      ...packageObject.scripts,
      build: "run-s clean build:*",
      ...((["browser", "bun", "deno"] as BuildTarget[])
        .map((item: BuildTarget) => targets?.includes(item))
        .reduce((acc, cur) => acc || cur, false)
        ? {
            "build:browser": "cross-env BUILD_ENV=browser rollup -c",
          }
        : {}),
      ...(targets?.includes("node-cjs")
        ? {
            "build:node-cjs":
              "cross-env BUILD_ENV=node-cjs ROLLUP_BUILD=1 rollup -c",
          }
        : {}),
      ...(targets?.includes("node-esm")
        ? { "build:node-esm": "cross-env BUILD_ENV=node-esm rollup -c" }
        : {}),
    },
  }));
}
