// Imports @skarllet modules
const queue = require('@skarllet/queue')
const events = require('@skarllet/events')
const states = require('@skarllet/state-machine')

// Imports local logic
// Parsers
const parseYamlString = require('./parsers/yaml')
const parseTemplateString = require('./parsers/template')

// Actions
const utilsActions = require('./actions/utils')
const eventsActions = require('./actions/events')
const browserActions = require('./actions/browser')
const stateMachineActions = require('./actions/statemachine')

const create = ({ DEBUG } = { DEBUG: false }) => {
  const q = queue.create()
  const s = states.create()
  const e = events.create()

  // Pipe all events from the queue and state machine to
  // the Agent event emmiter
  q.on('*', (payload, event) => e.emmit(event, payload))
  s.on('*', (payload, event) => e.emmit(event, payload))

  const phase = async (name, handler) => {
    const debug = event => DEBUG && e.emmit(event)
    try {
      debug(`DEBUG:START_${name}`)
      await handler()
      debug(`DEBUG:FINISHED_${name}`)
    } catch (error) {
      e.emmit('error', error)
    }
  }

  // This function runs the agent
  const run = async (yaml = null, json = '{}') => {
    let parsed = null
    let config = null

    // Template strings parse phase
    await phase('PARSING_TEMPLATE_STRINGS', async () => {
      parsed = parseTemplateString(yaml, JSON.parse(json))
    })

    // YAML config file parse phase
    await phase('PARSING_YAML', async () => {
      config = parseYamlString(parsed)
    })

    // Register states & actions phase
    await phase('PARSING_STATES', async () => {
      for (const { state, actions } of config.states) {
        s.add(state, () => {
          // Clear the query to register fresh events
          q.clear()

          // Adds the events
          for (const { action, ...payload } of actions)
            q.push(action, payload)
        })
      }
    })

    // Register events
    await phase('INITIALIZING_QUEUE_EVENTS', async () => {
      q.register(await utilsActions.create())
      q.register(await browserActions.create({
        headless: true,
        args: ['--no-sandbox']
      }))
      q.register(await eventsActions.create(e))
      q.register(await stateMachineActions.create(s))
    })

    await phase('START', async () => {
      e.emmit('started')
      s.change(config.start)
      q.start()
    })
  }

  return {
    run,
    on: e.on
  }
}

module.exports = { create }
