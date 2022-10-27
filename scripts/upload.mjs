import axios from 'axios'
import FormData from 'form-data'
import { createReadStream, existsSync } from 'fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'path'
// import pkg from '../package.json' assert { type: 'json' }
import pkg from '../package.json'

const isMac = process.platform === 'darwin'

async function getToken() {
  console.log(`# get token start.`)
  let token = process.argv[2]
  if (!token) {
    try {
      token = await readFile('./.token.local', 'utf8')
    } catch (e) {}
  }
  if (!token) {
    console.error(`# no such a private token defined.`)
    return process.exit(1)
  }
  token = token.trim()
  console.log(`# get token end. token: [${token}]`)
  return token
}

async function upload(token) {
  const fileName = `serviceforce-develop-tool_${pkg.version}.${isMac ? 'dmg' : 'exe'}`
  const filePath = join(`./release`, fileName)

  if (!existsSync(filePath)) {
    console.error(`# no such upload file in path: [${filePath}]`)
    return process.exit(1)
  }
  console.log(`# upload release start. path:[${filePath}]`)

  const stream = createReadStream(filePath)
  const formData = new FormData()
  formData.append('file', stream, fileName)
  const res = await axios({
    url: `http://g.lenovo.com.cn/api/v4/projects/2009/uploads`,
    method: 'post',
    headers: {
      'PRIVATE-TOKEN': token,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    data: formData,
  })
  console.log('# upload release end.')
  console.log(res.data)
  return res.data
}

async function createFile(data) {
  console.log(`# write info start.`)
  const infoFilePath = `./docs/public/download-${isMac ? 'mac' : 'win'}.json`
  await writeFile(infoFilePath, JSON.stringify({ version: pkg.version, ...data }, null, '  '))
  console.log(`# write info end: path: [${infoFilePath}]`)
}

async function start() {
  console.log(`# upload release start. version: [${pkg.version}]`)
  const token = await getToken()
  const data = await upload(token)
  await createFile(data)
  console.log(`'# upload release end.`)
}

start()
