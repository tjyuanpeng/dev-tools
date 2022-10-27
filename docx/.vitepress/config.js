export default {
  outDir: '../docs',
  base: '/dev-tools/',
  title: 'ServiceForce Develop Tool',
  head: [
    ['link', { rel: 'icon', href: '/dev-tool/favicon.png' }],
    ['script', { id: 'LA_COLLECT', src: '//sdk.51.la/js-sdk-pro.min.js' }],
    ['script', {}, 'LA.init({id: "JnAgC0nRJJ9OhL0c",ck: "JnAgC0nRJJ9OhL0c"})'],
  ],
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    siteTitle: 'ServiceForce Develop Tool',
    nav: [
      { text: '首页', link: '/' },
      { text: '教程', link: '/guide/index.html' },
      { text: '下载', link: '/download/' },
      { text: 'Issues', link: 'https://github.com/tjyuanpeng/dev-tools/issues' },
      { text: 'Github', link: 'https://github.com/tjyuanpeng/dev-tools' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '安装', link: '/guide/install' },
            { text: '代理规则', link: '/guide/proxy-rules' },
            { text: '日志', link: '/guide/logs' },
            { text: '选项', link: '/guide/options' },
            { text: '升级', link: '/guide/update' },
          ],
        },
      ],
    },
  },
}
