// Imports @skarllet modules
const create = async handler => {
  const plugins = require('@skarllet/plugins').create()

  // Initialize all default plugins
  await plugins.register(require('./plugins/states'))
  await plugins.register(require('./plugins/events'))
  await plugins.register(require('./plugins/actions'))

  // Access all needed plugins
  const states = plugins.use('states')
  const events = plugins.use('events')
  const actions = plugins.use('actions')

  handler({ plugins, events, actions, states })
}

module.exports = { create }
