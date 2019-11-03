import Client from 'ftp'
import { Stream } from 'stream'

export default (host: string, file: string): Promise<string> => new Promise((res, rej) => {
  const c = new Client()

  c.on('ready', () => c.get(file, (err: Error, stream: Stream) => {
    if (err) rej(err)
    let contents: string = ''

    stream.on('data', data => contents += data)
    stream.on('end', () => {
      c.end()
      res(contents)
    })
  }))

  c.connect({
    host
  })
})