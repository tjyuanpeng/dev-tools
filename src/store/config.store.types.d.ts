interface EnvItem {
  key: string
  label: string
  value: string
}

interface Rule {
  enable: boolean
  matchMode: string
  from: string
  env: string
  envPath: string
  to: string
}

interface DefaultRule {
  env: string
  envPath: string
  to: string
}
