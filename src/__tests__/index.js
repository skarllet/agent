const agent = require('../index');

const createTestStepThatDoesntThrowAnError = (eventA, eventB, ...startArguments) => {
  test('Should not call the error event when running the step', done => {
    const { run, on } = agent.create({ DEBUG: true })
    const errorCallback = jest.fn()
    const startCallback = jest.fn()

    on('error', errorCallback)

    on(eventA, startCallback)

    on(eventB, () => {
      expect(errorCallback).not.toHaveBeenCalled()
      expect(startCallback).toHaveBeenCalled()
      done()
    })

    run(...startArguments)
  })
}

describe('Agent', () => {
  describe('Tests the exposed return of the module', () => {
    test('should have one propety', () => {
      expect(Object.entries(agent).length).toBe(1)
    })

    test('should have the `create` propety', () => {
      expect(agent).toHaveProperty('create')
    })
  })

  describe('Tests the `creation` phase', () => {
    // This phase should initiate all the base systems

    test('should have two propeties', () => {
      const instance = agent.create()
      expect(Object.entries(instance).length).toBe(2)
    })

    test('should have the `run` and `on` propeties', () => {
      const instance = agent.create()
      expect(instance).toHaveProperty('on')
      expect(instance).toHaveProperty('run')
    })

    describe('Tests the `run` function', () => {

      describe('Tests the states & actions parse step', () => {
        const instructions = {
          name: 'Test',
          start: 'foo',
          states: [
            {
              state: 'foo',
              actions: [
                {
                  action: 'agent:emmit',
                  event: 'foo'
                }
              ]
            }
          ]
        }

        createTestStepThatDoesntThrowAnError(
          'DEBUG:START_PARSING_STATES',
          'DEBUG:FINISHED_PARSING_STATES',
          instructions
        )
      })

      describe('Tests the events initialization', () => {
        const isntructions = {
          name: 'Test',
          start: 'foo',
          states: [
            {
              state: 'foo',
              actions: [
                {
                  action: 'agent:emmit',
                  event: 'foo'
                }
              ]
            }
          ]
        }

        createTestStepThatDoesntThrowAnError(
          'DEBUG:START_INITIALIZING_QUEUE_EVENTS',
          'DEBUG:FINISHED_INITIALIZING_QUEUE_EVENTS',
          isntructions
        )
      })

      describe('Tests a complete initialization', () => {
        test('should recieve an start event after the succefully start', done => {
          const { run, on } = agent.create({ DEBUG: true })

          const instructions = {
            name: 'Test',
            start: 'foo',
            states: [
              {
                state: 'foo',
                actions: [
                  {
                    action: 'agent:emmit',
                    event: 'foo'
                  }
                ]
              }
            ]
          }

          on('started', () => done())

          run(instructions)
        })
      })

      describe('Tests the behavior of puppeteer', () => {
        // This must have mutch more tests, but, one test is better that none ;)

        test('Should execute browser:close event without throwing an error', done => {
          expect.assertions(3)
          const { run, on } = agent.create({ DEBUG: true })

          const errorCallback = jest.fn()
          const startedCallback = jest.fn()
          const nextCallBack = jest.fn()

          const instructions = {
            name: 'Test',
            start: 'initialize',
            states:
              [{
                state: 'initialize',
                actions: [{ action: 'agent:state:change', to: 'cleanup' }]
              },
              {
                state: 'cleanup',
                actions:
                  [{ action: 'browser:close' },
                  { action: 'agent:emmit', event: 'agent:finished' }]
              }]
          }

          on('error', errorCallback)
          on('started', startedCallback)
          on('next', nextCallBack)

          on('agent:finished', () => {
            expect(startedCallback).toHaveBeenCalled()
            expect(errorCallback).not.toHaveBeenCalled()
            expect(nextCallBack).toHaveBeenCalledTimes(3)
            done()
          })

          run(instructions)
        })
      })
    })
  })
})
