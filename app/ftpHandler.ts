import Client from 'ftp'
import { Stream } from 'stream'
import NodeCache from 'node-cache'
import { parse } from 'fast-xml-parser'

const cachedStuff = new NodeCache()

export default (host: string, file: string): Promise<string> => new Promise((res, rej) => {
  const cache: string | undefined = cachedStuff.get(`ftpFile${file}`)
  if (cache) res(cache)

  const client = new Client()

  client.on('ready', () => 
    client.get(file, (err: Error, stream: Stream) => {
      if (err) rej(err)
      let contents: string = ''

      stream.on('data', data => contents += data )
      stream.on('end', () => {
        client.end()
        const d = parse(contents).product.amoc
        if (d['expiry-time']) cachedStuff.set(`ftpFile${file}`, contents, Date.parse(d['expiry-time']) - Date.now())
        res(contents)
      })
  }))

  client.connect({
    host
  })
})
