const puppeteer = require('puppeteer')

const mouse = require('./mouse')

const create = async (options = {}) => {
  let browser = null
  let page = null

  // Grants the puppeteer is not initialized when not used
  const initialize = async () => {
    if (browser) return

    browser = await puppeteer.launch(options)
    page = await browser.newPage()

    await page.setViewport({ width: 1240, height: 720 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
      const newProto = navigator.__proto__
      delete newProto.webdriver
      navigator.__proto__ = newProto
    })
  }

  const returnable = {
    'browser:close': async () => await browser.close(),
    'browser:page:url': async ({ url }) => await page.goto(url, { waitUntil: 'load' }),
    'browser:page:screenshot': async config => await page.screenshot(config || {}),
    'browser:page:wait:selector': async ({ query }) => await page.waitForSelector(query),
    'browser:page:wait:navigation': async config => await page.waitForNavigation(config),

    ...mouse.create(page),
  }

  const handler = {
    get(target, key, a) {
      if (key === 'then' || key === 'catch')
        return target

      const action = target[key]

      return async (...params) => {
        await initialize()
        await action(...params)
      }
    }
  }

  // create a proxy to any function called
  // and initializes the puppeteer if it is
  // not initialized
  return new Proxy(returnable, handler)
}

module.exports = { create }
