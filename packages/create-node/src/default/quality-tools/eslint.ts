import writeFile from "../../util/write-file";

import {
  appendRunS,
  update as updatePackageJson,
} from "../../default/create/package-json";
import { CreateCommandOptions } from "../../types";

export const eslintConfig = {
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },

  // uncomment for eslint rules
  extends: [
    "plugin:sonar/recommended",
    "plugin:sonarjs/recommended",
    "prettier",
  ],
  plugins: ["prettier", /*"sonar",*/ "sonarjs"],
  root: true,
  rules: {
    "consistent-return": 2,
    "max-len": ["error", 120],
    "max-lines-per-function": ["error", 20],
    "max-params": ["error", 3],
    "no-else-return": 1,
    "sonar/no-invalid-await": 0,
    "space-unary-ops": 2,
    curly: ["error", "all"],
    indent: [1, 2],
    semi: [1, "always"],
  },
};

/**
 * @param options {{
      language: 'js' | 'ts' | 'coffee',
      testFramework: 'ava' | 'deno' | 'mocha' | 'jasmine' | 'jest' | 'vitest'
    }}
 * @param config {object}
 */
export default async function (
  options: CreateCommandOptions,
  config = eslintConfig
) {
  const { language, testFramework, logger } = options;
  logger?.info("updating package.json for (generic) eslint tool...");

  if (["ava", "jest", "mocha"].includes(testFramework)) {
    config.extends.push(`plugin:${testFramework}/recommended`);
  }

  const stringConfig = `// .eslintrc.js

module.exports = ${JSON.stringify(config, null, 2)};`;

  await writeFile(".eslintrc.js", stringConfig, options);

  return updatePackageJson(options, (object) => ({
    ...object,
    scripts: {
      ...(object as any).scripts,
      ca: appendRunS((object?.scripts as any)?.ca, "ca:lint"),
      "ca:lint": appendRunS((object?.scripts as any)?.["ca:lint"], "lint"),
      lint: "run-s lint:*",
      "lint:eslint": `eslint ./{src,test}/**/*.${language} --fix`,
    },
  }));
}
