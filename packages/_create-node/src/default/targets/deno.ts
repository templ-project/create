import { CreateCommandOptions } from "../../types.js";
import { update as updatePackageJson } from "../create/package-json.js";

export default async function (options: CreateCommandOptions) {
  const { logger } = options;
  logger?.info("updating package.json for deno build...");

  return updatePackageJson(options, (object) => ({
    ...object,
    exports: {
      ...object.exports,
      ".": {
        ...object.exports?.["."],
        deno: "./dist/worker/index.js",
      },
    },
  }));
}
