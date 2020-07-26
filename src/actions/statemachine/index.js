const create = async sm => ({
  'agent:state:change': async ({ to }) => sm.change(to)
})

module.exports = {
  create
}
