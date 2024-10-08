import { CreateCommandOptions, ProgrammingLanguage } from "../../types.js";
import { jestSpecJs, jestTestJs } from "../../constants.js";
import {
  PackageJsonOptions,
  update as updatePackageJson,
} from "../create/package-json.js";
import writeFile from "../../util/write-file.js";
import writeTestFiles from "./write-test-files.js";

export type JestConfig = {
  clearMocks: boolean;
  coverageDirectory: string;
  moduleFileExtensions: string[];
  roots: string[];
  testEnvironment: string;
  testMatch: string[];
  [key: string]: unknown;
};

export const jestConfig = (language: ProgrammingLanguage): JestConfig => ({
  clearMocks: true,
  coverageDirectory: "coverage",
  moduleFileExtensions: [...new Set(["js", language, "json", `${language}x`])],
  roots: ["."],
  testEnvironment: "node",
  testMatch: [`**/{src,test}/**/*.{spec,test}.${language}`],
});

export default async function (
  options: CreateCommandOptions,
  config?: JestConfig,
  spec = jestSpecJs,
  test = jestTestJs,
) {
  const { language, logger, testFramework } = options;
  logger?.verbose(`configuring ${testFramework}...`);

  config = config || jestConfig(language!);

  await updatePackageJson(options, (object: PackageJsonOptions) => ({
    ...object,
    scripts: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...object.scripts,
      test: `cross-env NODE_ENV=test ${
        language === "js" ? "BUILD_ENV=node-cjs" : ""
      } NO_API_DOC=1 jest --coverage --runInBand --verbose`,
      "test:watch": "npm run test -- --watch",
    },
  }));

  const stringConfig = `// jest.config.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  await writeFile("jest.config.js", stringConfig, options);

  return writeTestFiles(options, test, spec);
}
