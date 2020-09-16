const name = 'states'

const setup = plugin => {
  // Initialize the state machine
  const states = {}

  const register = (name, handler) => states[name] = handler

  const change = async (state, emmitFinishEvent = true) => {
    const events = plugin.use('events')
    const actions = plugin.use('actions')

    events.emmit('state:change', { state })

    try {
      return await states[state]({ actions, change: state => change(state, false) })
    } catch (error) {
      throw { type: 'state', where: state, error }
    } finally {
      if (emmitFinishEvent)
        events.emmit('state:finish')
    }
  }

  return {
    register,
    change
  }
}

module.exports = { name, setup }
