import {BuildCommandOptions} from '../../types';

export const generateBuildCommand = ({target, buildTool}: Pick<BuildCommandOptions, 'target' | 'buildTool'>) =>
  `create-node build --target ${target} --build-tool ${buildTool}`;
