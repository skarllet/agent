// Imports @skarllet modules
const queue = require('@skarllet/queue')
const events = require('@skarllet/events')
const states = require('@skarllet/state-machine')

// Imports local logic
const parseTemplateString = require('./parsers/template');

const create = ({ DEBUG } = { DEBUG: false }) => {
  const q = queue.create()
  const s = states.create()
  const { on, emmit } = events.create()

  // Pipe all events from the queue and state machine to
  // the Agent event emmiter
  q.on('*', ({ event, payload }) => emmit(event, payload))
  s.on('*', ({ event, payload }) => emmit(event, payload))

  // This function boostraps all
  const run = async (yaml = null, json = '') => {
    let parsed = null
    let config = null

    // Template strings parse phase
    try {
      if (DEBUG)
        emmit('DEBUG:START_PARSING_TEMPLATE_STRINGS')

      parsed = parseTemplateString(yaml, JSON.parse(json))

      if (DEBUG)
        emmit('DEBUG:FINISHED_PARSING_TEMPLATE_STRINGS')
    } catch (error) {
      emmit('error', error)
      throw error
    }

  }

  return { run, on }
}

module.exports = { create }
