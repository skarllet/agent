const name = 'actions'

const setup = plugin => {
  const actions = {}

  const register = (name, handler) => actions[name] = handler

  const dispatch = async (action, payload) => {
    const events = plugin.use('events')

    events.emmit('action:dispatch', { action, payload })

    try {
      return await actions[action](payload)
    } catch (error) {
      throw { type: 'action', where: action, error }
    }
  }

  return {
    register,
    dispatch,
  }
}

module.exports = { name, setup }