const create = async () => ({
  'agent:sleep': ({ delay = 1000 }) => new Promise(resolve => setTimeout(resolve, delay)),
})

module.exports = {
  create
}
