const name = 'state'

const setup = plugin => {
  // Use other plugins
  const events = plugin.use('events')
  const actions = plugin.use('actions')

  // Initialize the state machine
  const state = require('@skarllet/state-machine').create()

  // Pipe all events to the events plugin
  state.on('*', (payload, event) => events.emmit(event, payload))

  // Register a action to be avaliable to the user
  actions.register('agent:state:change', async ({ to }) => state.change(to))

  return state
}

module.exports = { name, setup }
