# Agent

## Objective
**Agent** is a tool that facilitates (in theory) the creation of robots based on states and actions. But what does this mean in practice?

In practice, you declare the robot's behavior in a YAML file defining states and actions.

The states can be switched between themselves at any time, the goal is to give flexibility to perform repetitive actions in a format that is simpler to understand. Within each state, there are actions, they are important because it is in them that the executions of behavior by the browser are declared.

There is a predefined number of actions that can be performed (read the documentation below), in the future these actions may be imported from any public GitHub repository that follows the standards, facilitating the modularization and extension of **Agent**.

## How to use it

### Example
```js
// First, we need to import the module
const agent = require('@skarllet/agent')

// Create an instance
const { run, on } = agent.create() // The create function returns a object with the functions 'run' and 'on'

// Any error that occours insite the run function will be catched by the error handler
on('error', () => {
  // Handles an error
})

// When a state changes, an 'change' event will be fired
on('change', () => {
  // Maybe log something
})

// When a action is starting to be executed a next event will be fired
on('next', () => {
  // Maybe log something
})

// When the agent starts running the started event will be fired
on('started', () => {
  // Maybe log something
})

// A custom event emmited by the agent, defined by the user
on('custom_event', () => {
  // Maybe do something
})

// A instruction object that defines the behavior of the agent
const instructions = {
  name: 'foo',
  start: 'state:load:google',
  states: [
    {
      state: 'state:load:google',
      actions:
        [
          {
            action: 'browser:page:url',
            url: 'https://www.google.com'
          },
          {
            action: 'browser:close'
          },
          {
            action: 'agent:emmit',
            event: 'custom_event'
          }
        ]
    }
  ]
}

// Call the run function that initiates the Agent
run(instructions)
  .catch(() => {
    // handle some error that may occour inside and desnt is handled
  })
```

## Events
Please reffer to ``` ./src/actions ``` to see all events and parameters, this section will be documented properly in the future.
