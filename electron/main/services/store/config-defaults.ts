export default {
  window: {},
  notification: true,
  proxy: {
    port: 8000,
    defaultRule: {
      env: 'local-8001',
      envPath: '',
      to: 'http://localhost:8001/',
    },
    rules: [
      {
        enable: true,
        matchMode: 'prefix',
        from: '/demo',
        env: 'local-8001',
        envPath: '',
        to: 'http://localhost:8001/',
      },
    ],
    env: [
      {
        label: '本地环境-8001',
        key: 'local-8001',
        value: 'http://localhost:8001/',
      },
      {
        label: '本地环境-8080',
        key: 'local-8080',
        value: 'http://localhost:8080/',
      },
      {
        label: '本地环境-8081',
        key: 'local-8081',
        value: 'http://localhost:8081/',
      },
      {
        label: '本地环境-8090',
        key: 'local-8090',
        value: 'http://localhost:8090/',
      },
      {
        label: '本地环境-8091',
        key: 'local-8091',
        value: 'http://localhost:8091/',
      },
    ],
  },
}
