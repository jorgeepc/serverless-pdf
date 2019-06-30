import puppeteer from 'puppeteer-core'
import getOptions from './options'
let _page = null

async function getPage(isDev) {
  if (_page) {
    return _page
  }
  const options = await getOptions(isDev)
  const browser = await puppeteer.launch(options)
  _page = await browser.newPage()
  return _page
}

export default async function getPdf(url, isDev) {
  const page = await getPage(isDev)
  await page.goto(url, { waitUntil: 'networkidle2' })

  const css = `
    <style>
      .brand { font-size:8px;z-index:1000;color:#4E5974;text-align:center;margin-left:30px;}
    </style>
  `

  const file = await page.pdf({
    format: 'A4',
    displayHeaderFooter: true,
    headerTemplate:
      css + '<div class="brand"><span class="title"></span></div>',
    footerTemplate:
      css +
      '<div class="brand"><span class="pageNumber"></span>/<span class="totalPages"></span></div> <div class="brand">Serverless PDF <span class="date"></span></div>',
    margin: {
      top: 50,
      bottom: 50,
      left: 30,
      right: 30
    },
    printBackground: true
  })
  return file
}
