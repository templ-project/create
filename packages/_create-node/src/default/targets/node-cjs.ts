import { CreateCommandOptions } from "../../types.js";
import { update as updatePackageJson } from "../create/package-json.js";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.info("updating package.json for Node.js CSJ build...");

  return updatePackageJson(options, (object) => ({
    ...object,
    main: "dist/node-cjs/index.js",
    exports: {
      ...object.exports,
      ".": {
        ...object.exports?.["."],
        require: "./dist/node/node-cjs/index.js",
      },
    },
  }));
}
