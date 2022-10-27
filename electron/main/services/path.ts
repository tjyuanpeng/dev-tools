import { join } from 'path'
import { app } from 'electron'

export const rootPath = join(__dirname, '../..')
export const preloadPath = join(__dirname, '../preload')
export const publicPath = app.isPackaged ? rootPath : join(rootPath, '../public')

export const getPathByRoot = path => join(rootPath, path)
export const getPathByPublic = path => join(publicPath, path)
export const getPathByPreLoad = path => join(preloadPath, path)
