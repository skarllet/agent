const vector = require('./utils/vector');

const create = page => {
  const INTERVAL = 16.6; // 60fps;

  let position = vector.create(0, 0);

  const mouseMove = ({ x, y }, duration = 250) => new Promise((resolve) => {
    const steps = Math.round(duration / INTERVAL)
    let count = 0

    const to = vector.create(x, y)
    const delta = vector.sub(to, position)
    const step = vector.div(delta, steps)

    const interval = setInterval(() => {
      const isDone = count > steps

      if (isDone) {
        clearInterval(interval)
        resolve(position)
        return
      }

      position = vector.add(position, step)

      page.mouse.move(position.x - 1, position.y - 1)

      count++;
    }, INTERVAL)
  })

  return {
    'browser:page:mouse:move': mouseMove,

    'browser:page:mouse:move:to': async ({ query }, duration) => {
      const { x, y, width, height } = await page.evaluate(query => {
        const { x, y, width, height } = document
                          .querySelector(query)
                          .getBoundingClientRect()
        return { x, y, width, height }
      }, query)

      await mouseMove({ x: x + width / 2, y: y + height / 2 }, duration)
    },

    'browser:page:mouse:click': async () => {
      await page.mouse.down()
      await page.mouse.up()
    }
  }
}

module.exports = { create }
