import { parse } from 'url'
import getPdf from './chromium'

const isDev = process.env.NOW_REGION === 'dev1'

export default async function handler(req, res) {
  try {
    const { pathname = '/' } = parse(req.url || '')
    const url = pathname.slice(1)

    if (url === '') {
      throw new Error('Expected an url')
    }

    const file = await getPdf(url, isDev)
    res.statusCode = 200
    res.setHeader('Content-Type', `application/pdf`)
    res.setHeader('Content-Length', file.length)
    res.setHeader(
      'Cache-Control',
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    )
    res.end(file)
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/html')
    res.end('<h1>Internal error</h1>')
    console.error(e) // eslint-disable-line no-console
  }
}
