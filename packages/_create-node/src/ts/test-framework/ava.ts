import readRepoFile from "../../util/read-repo-file.js";

import ava from "../../default/test-framework/ava.js";
import writeFile from "../../util/write-file.js";
import { CreateCommandOptions } from "../../types.js";
import { avaSpecJs, avaTestTs } from "../../constants.js";

export default async function (options: CreateCommandOptions) {
  const avaConfig = await readRepoFile(
    "../../static/ts/ava.config.js",
    options,
  );
  await writeFile("ava.config.js", avaConfig, options);

  return ava(options, avaSpecJs, avaTestTs);
}
