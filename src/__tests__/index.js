const agent = require('../index')

const createTestStepThatDoesntThrowAnError = (eventA, eventB, ...startArguments) => {
  test('Should not call the error event when running the step', async done => {
    const { run, on } = await agent.create({ DEBUG: true })
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
    test('should have the `run` and `on` propeties', async () => {
      const instance = await agent.create()
      expect(instance).toHaveProperty('on')
      expect(instance).toHaveProperty('run')
      expect(Object.entries(instance).length).toBe(2)
    })

    describe('Tests the `run` function', () => {
      describe('Tests the plugins initialization', () => {
        const isntructions = {
          name: 'Test',
          start: 'foo',
          states: [
            {
              state: 'foo',
              actions: [
                {
                  action: 'agent:event:emmit',
                  event: 'foo'
                }
              ]
            }
          ]
        }

        createTestStepThatDoesntThrowAnError(
          'DEBUG:START_INITIALIZING_PLUGINS',
          'DEBUG:FINISHED_INITIALIZING_PLUGINS',
          isntructions
        )
      })


      describe('Tests the states & actions parse step', () => {
        const instructions = {
          name: 'Test',
          start: 'foo',
          states: [
            {
              state: 'foo',
              actions: [
                {
                  action: 'agent:event:emmit',
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

      describe('Tests a complete initialization', () => {
        test('should recieve an start event after the succefully start', async done => {
          const { run, on } = await agent.create({ DEBUG: true })

          const instructions = {
            name: 'Test',
            start: 'foo',
            states: [
              {
                state: 'foo',
                actions: [
                  {
                    action: 'agent:event:emmit',
                    event: 'foo'
                  }
                ]
              }
            ]
          }

          on('started', () => done())

          run(instructions)
        })

        test('should recieve an finish event after the succefully executes all states and actions', async done => {
          expect.assertions(3)

          const { run, on } = await agent.create({ DEBUG: true })

          const fooHandler = jest.fn()
          const nextHandler = jest.fn()
          const changeHandler = jest.fn()

          const instructions = {
            name: 'Test',
            start: 'foo',
            states: [
              {
                state: 'foo',
                actions: [
                  {
                    action: 'agent:event:emmit',
                    event: 'foo'
                  },
                  {
                    action: 'agent:state:change',
                    to: 'bar'
                  }
                ]
              },
              {
                state: 'bar',
                actions: [
                  {
                    action: 'agent:event:emmit',
                    event: 'foo'
                  }
                ]
              }
            ]
          }

          on('foo', fooHandler)
          on('next', nextHandler)
          on('change', changeHandler)

          on('finish', () => {
            expect(fooHandler).toHaveBeenCalledTimes(2)
            expect(nextHandler).toHaveBeenCalledTimes(3)
            expect(changeHandler).toHaveBeenCalledTimes(2)
            done()
          })

          run(instructions)
        })
      })

      describe('Tests the behavior of the dynamic plugin import', () => {
        test('Should install and register @someone/dummy-plugin without throwing an error', async done => {
          expect.assertions(5)

          const { run, on } = await agent.create({ DEBUG: true })

          const startedCallback = jest.fn()
          const changeCallBack = jest.fn()
          const errorCallback = jest.fn()
          const nextCallBack = jest.fn()
          const pluginInstalledCallback = jest.fn()

          const instructions = {
            name: 'facking agent ;)',

            start: 'initialize',

            plugins: [
              {
                module: 'C:\\Users\\U002997\\Desktop\\Personal\\agent\\src\\__tests__\\mock\\plugin',
                config: {}
              }
            ],

            states: [
              {
                state: 'initialize',
                actions: [
                  {
                    action: 'agent:event:emmit',
                    event: 'foo'
                  }
                ]
              }
            ]
          }

          on('started', startedCallback)

          on('installed', pluginInstalledCallback)

          on('change', changeCallBack)
          on('next', nextCallBack)

          on('error', errorCallback)
          on('error', console.log)

          on('finish', () => {
            expect(startedCallback).toHaveBeenCalled()

            expect(pluginInstalledCallback).toHaveBeenCalledTimes(1)

            expect(changeCallBack).toHaveBeenCalledTimes(1)
            expect(nextCallBack).toHaveBeenCalledTimes(1)

            expect(errorCallback).not.toHaveBeenCalled()

            done()
          })

          run(instructions)
        })
      })
    })
  })
})
