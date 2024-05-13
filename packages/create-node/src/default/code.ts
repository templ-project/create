import {join as joinPath} from 'path';
import {rimraf} from 'rimraf';

import {GenericCommandOptions} from '../types';
import writeFile from '../util/write-file';
import {codeJs} from '../constants';

export default async function <T extends GenericCommandOptions>(options: T, code = codeJs): Promise<void> {
  const {language, logger, projectPath} = options;

  logger?.verbose('creating src/ ...');

  await rimraf(joinPath(projectPath!, 'src'));

  return writeFile(joinPath('src', `index.${language}`), code, options);
}
