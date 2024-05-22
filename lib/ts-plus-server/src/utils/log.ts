import type TS from 'typescript/lib/tsserverlibrary';

type Log = (message: any) => void;

const createLog =
  (pluginName: string, info: TS.server.PluginCreateInfo): Log =>
  message =>
    info.project.projectService.logger.info(`${pluginName}: ${message}`);

export { createLog, Log };
