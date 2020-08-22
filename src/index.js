// Imports @skarllet modules
const plugins = require('@skarllet/plugins')
const modules = require('./modules')

const create = async ({ DEBUG } = { DEBUG: false }) => {
  const plugin = plugins.create()

  // Initialize all default plugins
  await plugin.register(require('./plugins/actions'))
  await plugin.register(require('./plugins/events'))
  await plugin.register(require('./plugins/queue'))
  await plugin.register(require('./plugins/state'))

  // Access all needed plugins
  const queue = plugin.use('queue')
  const state = plugin.use('state')
  const events = plugin.use('events')

  // A phase is something that helps debugging in witch stage
  // the execution broke, if it broke
  const phase = async (name, handler) => {
    const debug = event => DEBUG && events.emmit(event)

    try {
      debug(`DEBUG:START_${name}`)
      await handler()
      debug(`DEBUG:FINISHED_${name}`)
    } catch (error) {
      events.emmit('error', error)
      events.emmit('finish', error)
    }
  }

  // The run function interprets and execute the instruction object,
  // initializes all data and populate the plugins with the data needed.
  const run = async (instructions = null) => {
    // Register plugins
    await phase('INITIALIZING_PLUGINS', async () => {
      const { plugins = [] } = instructions

      for (const { module, config } of plugins) {
        // Install a module with NPM
        const { name, version } = await modules.install(module)

        plugin.register(modules.require(name), config)

        events.emmit('installed', { name, version })
      }
    })

    // Register states & actions phase
    await phase('PARSING_STATES', async () => {
      const { states = [] } = instructions

      for (const { state: stateName, actions } of states) {
        state.add(stateName, () => {
          // Clear the query to register fresh events
          queue.clear()

          // Adds the events
          for (const { action, ...payload } of actions)
            queue.push({ action, payload })
        })
      }
    })

    await phase('START', async () => {
      events.emmit('started')
      state.change(instructions.start)
      queue.start()
    })
  }

  return {
    run,
    on: events.on
  }
}

module.exports = { create }
