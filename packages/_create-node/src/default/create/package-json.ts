import { requiresNyc } from "../../util/test-framework.js";
import readFile from "../../util/read-file.js";
import writeFile from "../../util/write-file.js";
import { CreateCommandOptions, GenericCommandOptions } from "../../types.js";

export const packageJson = "package.json";

export type PackageJsonExports = {
  ["."]: Record<string, string>;
  [key: string]: string | Record<string, string>;
};

export type PackageJsonOptions = {
  exports?: PackageJsonExports;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  [key: string]: unknown;
};

const addNycConfigToPackageJson = async (
  options: CreateCommandOptions,
): Promise<void> => {
  const { logger } = options;
  logger?.verbose("adding nyc config to package.json");

  return update(options, (object: PackageJsonOptions) => ({
    ...object,
    ...(requiresNyc(options.testFramework)
      ? {
          nyc: {
            reporter: ["html", "lcov", "text"],
            exclude: ["test*", "dist", "*", ".scripts", "coverage"],
            all: true,
          },
        }
      : {}),
  }));
};

const runProjectInit = async (options: CreateCommandOptions): Promise<void> => {
  const { logger } = options;
  if (!process.env.SKIP_NPM_INIT) {
    logger?.verbose("initializing project...");
    return import(`../util/package-manager/${options.packageManager}`).then(
      (binary) => binary.init(options),
    );
  }
  logger?.debug("project init skiped.");
  try {
    logger?.verbose("updating package.json");
    return await update(options, (object) => object);
  } catch (e) {
    logger?.warn("package.json doesn't exist", e);
  }
  logger?.verbose("creating package.json");
  return await writeFile(packageJson, "{}", options);
};

export default async function (options: CreateCommandOptions): Promise<void> {
  await runProjectInit(options);
  return addNycConfigToPackageJson(options);
}

export async function read<T extends GenericCommandOptions>(
  options: T,
): Promise<PackageJsonOptions> {
  return readFile(packageJson, options).then(
    (json) => JSON.parse(json) as PackageJsonOptions,
  );
}

export async function write<T extends GenericCommandOptions>(
  options: T,
  object: PackageJsonOptions,
): Promise<void> {
  return writeFile(packageJson, object, options);
}

export async function update<T extends GenericCommandOptions>(
  options: T,
  callback:
    | PackageJsonOptions
    | ((object: PackageJsonOptions) => PackageJsonOptions),
): Promise<void> {
  return read(options)
    .then(
      (object: PackageJsonOptions) =>
        ({
          ...(typeof callback === "function"
            ? callback(object)
            : typeof callback === "object"
              ? {
                  ...object,
                  ...callback,
                }
              : {}),
        }) as PackageJsonOptions,
    )
    .then((object) => write(options, object));
}

export function appendRunS(command: string, script: string): string {
  return [
    ...new Set(["run-s", ...(command || "run-s").split(" ").slice(1), script]),
  ].join(" ");
}

export function appendRunP(command: string, script: string): string {
  return [
    ...new Set(["run-p", ...(command || "run-p").split(" ").slice(1), script]),
  ].join(" ");
}
