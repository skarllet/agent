const create = async ({ emmit }) => ({
  'agent:emmit': async ({ event, payload }) => emmit(event, payload)
})

module.exports = {
  create
}
