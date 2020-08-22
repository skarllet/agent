const name = 'events'

const setup = plugin => {
  // Uses the actions plugin
  const actions = plugin.use('actions')

  // Create
  const events = require('@skarllet/events').create()

  // Register a action to be avaliable to the user
  actions.register('agent:event:emmit', async ({ event, payload }) => events.emmit(event, payload))

  // Expose the methods to all other plugins
  return events
}

module.exports = { name, setup }