import puppeteer from 'puppeteer'
import Cheerio from 'cheerio'
import CDP from 'chrome-remote-interface'

console.log('> PID: %s', process.pid)

const gray = (msg: string) => '\x1b[90m' + msg + '\x1b[0m'
const cyan = (msg: string) => '\x1b[36m' + msg + '\x1b[0m'

const port = +(process.env.PORT || 9222)
console.log(
  '> Using port %s %s',
  port,
  gray('(Note: You may define PORT=1234 if you prefer)'),
)

console.log(
  `\nNOTE: You may notice how Ctrl+C won't stop the program. The following command kills this and the Chrome process.\n\n\t` +
    cyan(`kill -9 ${process.pid} && bunx kill-port ${port}\n`),
)

const browser = await puppeteer.launch({
  headless: true,
  debuggingPort: port,
  dumpio: true,
})
console.log('> Puppeteer launched')

const cdp = await CDP({ port })
console.log('> CDP client connected')

await cdp.Page.navigate({ url: 'https://news.ycombinator.com' })
console.log('> navigated to Hacker News')

const { result } = await cdp.Runtime.evaluate({
  expression: 'document.documentElement.outerHTML',
})

const $ = Cheerio.load(result.value)

console.log('')
$('.titleline').map((_i, el) => {
  console.log($(el).text())
})

await cdp.close()
await browser.close()
