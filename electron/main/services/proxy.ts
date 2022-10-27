import http from 'http'
import httpProxy from 'http-proxy'
import { EventEmitter } from 'events'
import { getStore } from './store'
import { getLog } from './log'
import { showNotice } from './notice'

interface ProxyRule {
  enable: boolean
  matchMode: string
  from: string
  to: string
}

const log = getLog('proxy')
const proxyEmitter = new EventEmitter()
let server = null
let proxy = null

function createUrl(url: string, base: string) {
  try {
    return new URL(url, base).toString()
  } catch (_e) {
    return '(create url error)'
  }
}

const createHandler = () => {
  // load configs
  const store = getStore()
  let rules: ProxyRule[] = store.get('proxy.rules')
  rules = rules.filter(r => r.enable)
  const defaultRule = store.get('proxy.defaultRule')

  // create handler
  return url => {
    for (const r of rules) {
      if (
        (r.matchMode === 'exact' && url === r.from) ||
        (r.matchMode === 'prefix' && url.startsWith(r.from)) ||
        (r.matchMode === 'regexp' && new RegExp(r.from).exec(url))
      ) {
        return r.to
      }
    }

    return defaultRule.to
  }
}

export async function start() {
  let restart = false
  if (isRunning()) {
    restart = true
    stop()
  }

  // create handler
  const getTargetUrl = createHandler()

  // create proxy server
  proxy = httpProxy.createProxyServer({
    followRedirects: true,
  })

  // handle proxy error
  proxy.on('error', function (e) {
    log.error(`[proxy] ${e}`)
  })

  proxy.on('proxyRes', function (proxyRes, req, res) {
    // add target url to header
    try {
      const port =
        proxyRes.req.socket.remotePort === 80 || proxyRes.req.socket.remotePort === 443
          ? ''
          : `:${proxyRes.req.socket.remotePort}`
      res.setHeader(
        'X-SFDT-TARGET',
        `${proxyRes.req.protocol}//${proxyRes.req.host}${port}${proxyRes.req.path}`
      )
    } catch (e) {
      log.error(`[proxy] [proxyRes] ${e}`)
    }

    // add http protocol to csp
    const csp = proxyRes.headers['content-security-policy']
    if (csp) {
      proxyRes.headers['content-security-policy'] = `${csp} http:`
    }
  })

  // create http server
  server = http.createServer(function (req, res) {
    const targetUrl = getTargetUrl(req.url)
    log.info(`[web] from:[${req.url}], to:[${createUrl(req.url, targetUrl)}]`)
    proxy.web(req, res, {
      target: targetUrl,
      changeOrigin: true,
    })
  })

  // handle websocket request
  server.on('upgrade', function (req, socket, head) {
    const targetUrl = getTargetUrl(req.url)
    log.info(`[ws] from:[${req.url}], to:[${targetUrl}]`)
    proxy.ws(req, socket, head, {
      target: targetUrl,
      changeOrigin: true,
    })
  })

  // handle http error
  server.on('error', function (e) {
    log.error(`[server] ${e}`)
  })

  // listen http port
  const port = getStore().get('proxy.port')
  const result = await new Promise(function (resolve, reject) {
    server.listen(port, e => {
      if (e) {
        log.error(`[server] listening has error ${e}`)
        reject(false)
      } else {
        log.info(`[server] start listening on port: [${port}]`)
        resolve(true)
      }
    })
  })

  if (result) {
    proxyEmitter.emit('change', true)
    if (!restart) {
      showNotice({ body: '代理服务：启动' })
    }
  }

  return result
}

export async function stop() {
  proxy?.close()
  server?.close()
  log.info(`[server] stop listening.`)
  proxyEmitter.emit('change', false)
}

export const isRunning = () => Boolean(server?.listening)

export const onProxyStatusChange = callback => proxyEmitter.on('change', callback)

export default () => {
  const store = getStore()
  store.onDidChange('proxy', (newValue, oldValue) => {
    if (isRunning()) {
      start()
    }

    log.debug(`proxy change`, newValue, oldValue)
  })
}
