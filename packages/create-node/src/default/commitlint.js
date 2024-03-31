import writeFile from "../util/write-file.js";

export const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
};

/** @param options {{language: 'js' | 'ts' | 'coffee'}} */
export default async function (options) {
  const { logger } = options;
  logger.verbose(`configuring commitlint...`);

  const commitlintrc = `// .commitlintrc.js

module.exports = ${JSON.stringify(commitlintConfig, null, 2)};`;

  return writeFile(".commitlintrc.js", commitlintrc, options);
}