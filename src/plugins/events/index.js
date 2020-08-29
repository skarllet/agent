const name = 'events'

const setup = () => {
  const events = {};

  const callEventHandlers = (event, payload, replace = null) => {
    if (events[replace || event])
      for (const handler of events[replace || event])
        handler(payload, event)
  }

  const emmit = (event, payload = null) => {
    callEventHandlers(event, payload)
    callEventHandlers(event, payload, '*')
  }

  const remove = (event, handler) => {
    if (!events[event])
      return

    events[event] = events[event].filter(h => h !== handler);
  }

  const on = (event, handler) => {
    // if the key doesnt exists it create
    if (!events[event])
      events[event] = []

    // Adds the event to the 
    events[event].push(handler)
  }

  return { emmit, on, remove }
}

module.exports = { name, setup }