import log from 'electron-log'

export default () => {
  console.log(`log file path: [${getLogFilePath()}]`)
  log.transports.file.level = 'debug'
  log.transports.ipc.level = 'info'

  process.on('uncaughtException', e => {
    getLog().error(e)
  })
}

export const getLogFilePath = () => log.transports.file.getFile().path

export const getLog = (scope = 'app') => log.scope(scope)
