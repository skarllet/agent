const name = 'actions'

const setup = () => {
  const actions = {}

  const register = (name, handler) => actions[name] = handler

  const execute = (name, payload) => actions[name](payload)

  return {
    register,
    execute,
  }
}


module.exports = { name, setup }