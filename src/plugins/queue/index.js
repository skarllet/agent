const name ='queue'

const setup = plugin => {
  // Use other plugins
  const events = plugin.use('events')
  const actions = plugin.use('actions')

  // Actions handler
  const handler = ({ action , payload }) => actions.execute(action, payload)

  // Initialize the queue
  const queue = require('@skarllet/queue').create(handler)

  // Pipe all events to the events plugin
  queue.on('*', (payload, event) => events.emmit(event, payload))

  // Expose the methods to all other plugins
  return queue
}

module.exports = { name, setup }