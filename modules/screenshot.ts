import puppeteer from 'puppeteer'

export async function takeScreenshot(url: string) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
  const buffer = await page.screenshot({ fullPage: false, type: 'jpeg', quality: 80 })
  await browser.close()
  return buffer
}

export default { takeScreenshot }
