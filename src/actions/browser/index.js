const puppeteer = require('puppeteer')

const mouse = require('./mouse')

const create = async (options = {}) => {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  await page.setViewport({ width: 1240, height: 720 })
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');
  await page.evaluateOnNewDocument(() => {
    const newProto = navigator.__proto__
    delete newProto.webdriver
    navigator.__proto__ = newProto
  })

  return {
    'browser:close': async () => await browser.close(),
    'browser:page:url': async ({ url, ...config }) => await page.goto(url, config),
    'browser:page:screenshot': async config => await page.screenshot(config || {}),
    'browser:page:wait:selector': async ({ query }) => await page.waitForSelector(query),
    'browser:page:wait:navigation': async config => await page.waitForNavigation(config),

    ...mouse.create(page),
  }
}

module.exports = { create }
