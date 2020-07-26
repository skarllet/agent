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
  q.on('*', ({ event, payload }) => e.emmit(event, payload))
  s.on('*', ({ event, payload }) => e.emmit(event, payload))

  const debug = event => DEBUG && e.emmit(event)

  // This function runs the agent
  const run = async (yaml = null, json = '{}') => {
    let parsed = null
    let config = null

    // Template strings parse phase
    try {
      debug('DEBUG:START_PARSING_TEMPLATE_STRINGS')

      parsed = parseTemplateString(yaml, JSON.parse(json))

      debug('DEBUG:FINISHED_PARSING_TEMPLATE_STRINGS')
    } catch (error) {
      e.emmit('error', error)
      throw error
    }

    // YAML config file parse phase
    try {
      debug('DEBUG:START_PARSING_YAML')

      config = parseYamlString(parsed)

      debug('DEBUG:FINISHED_PARSING_YAML')
    } catch (error) {
      e.emmit('error', error)
      throw error
    }

    // Register states & actions phase
    try {
      debug('DEBUG:START_PARSING_STATES')

      // Registers all the states
      for (const { state, actions } of config.states) {
        s.add(state, () => {
          // Clear the query to register fresh events
          q.clear()

          // Adds the events
          for (const { action, ...payload } of actions)
            q.push(action, payload)
        })
      }

      debug('DEBUG:FINISHED_PARSING_STATES')
    } catch (error) {
      e.emmit('error', error)
      throw error
    }

    // Register events
    try {
      debug('DEBUG:START_INITIALIZING_QUEUE_EVENTS')

      q.register(await utilsActions.create())
      q.register(await browserActions.create())

      q.register(await eventsActions.create(e))
      q.register(await stateMachineActions.create(s))

      debug('DEBUG:FINISHED_INITIALIZING_QUEUE_EVENTS')
    } catch (error) {
      e.emmit('error', error)
      throw error
    }

    // Start the execution of the Agent
    s.change(config.start)
    q.start()

    e.emmit('started')
  }

  return {
    run,
    on: e.on
  }
}

module.exports = { create }
