/**
 * @link https://typicode.github.io/husky/get-started.html
 * @link https://github.com/typicode/husky
 * @link https://www.npmjs.com/package/husky
 */

import { installDevDependencies, logger } from "@templ-project/core";
import { execa, $ } from "execa";

import { ProgramOptions } from "../options.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const huskySetup = async (projectPath: string, options: ProgramOptions) => {
  logger.debug("Setting up `husky`...");

  await installDevDependencies(options.packageManager, ["husky"], {
    cwd: projectPath,
  });

  await ensureGitInit(projectPath);

  await ensureHuskyInit(projectPath);

  await commitMsgSetup(projectPath);
  await preCommitSetup(projectPath);

  logger.debug("`husky`setup completed...");
};

export default huskySetup;

const ensureGitInit = async (projectPath: string) =>
  $("git", ["init"], {
    cwd: projectPath,
    stdout: ["pipe", "inherit"],
  });

const ensureHuskyInit = async (projectPath: string) =>
  execa("husky", [], {
    cwd: projectPath,
    preferLocal: true,
    stdout: ["pipe", "inherit"],
  });

export const commitMsgCommands = `npx --yes commitlint --edit $1`;

const commitMsgSetup = async (projectPath: string) => {
  const commitMsgPath = path.join(projectPath, ".husky", "commit-msg");

  await readFile(commitMsgPath)
    .then((commitMsg) => commitMsg.toString("utf-8"))
    .then((commitMsg) =>
      writeFile(
        commitMsgPath,
        `${commitMsg}

${commitMsgCommands}

`,
      ),
    );
};

export const preCommitCommands = `npm run ca
npm run test
npm run build

git add -u`;

const preCommitSetup = async (projectPath: string) => {
  const precommitPath = path.join(projectPath, ".husky", "pre-commit");
  await readFile(precommitPath)
    .then((preCommit) => preCommit.toString("utf-8"))
    .then((preCommit) =>
      writeFile(
        precommitPath,
        `${preCommit}

${preCommitCommands}

`,
      ),
    );
};
