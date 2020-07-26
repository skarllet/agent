const agent = require('../index');

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


    const createTestStepThatDoesntThrowAnError = (eventA, eventB, ...startArguments) => {
      test('Should not call the error event when running the step', done => {
        const { start, on } = agent.create({ DEBUG: true })
        const errorCallback = jest.fn()
        const startCallback = jest.fn()

        on('error', errorCallback)

        on(eventA, startCallback)

        on(eventB, () => {
          expect(errorCallback).not.toHaveBeenCalled()
          expect(startCallback).toHaveBeenCalled()
          done()
        })

        start(...startArguments)
      })
    }

    describe('Tests the `run` function', () => {

      describe('Tests the template string parse step', () => {
        const yaml = `
          name: 'Test'

          start: 'foo'

          states:
          - state: 'foo'
          actions:
          - action: 'foo'
          url: {{ google.url }}
        `

        const json = `
          {
            "google": {
              "url": "http://www.google.com.br"
            }
          }
        `

        createTestStepThatDoesntThrowAnError(
          'DEBUG:START_PARSING_TEMPLATE_STRINGS',
          'DEBUG:FINISHED_PARSING_TEMPLATE_STRINGS',
          yaml,
          json
        )
      })

      describe('Tests the YAML file parse step', () => {

        const yaml = `
          name: 'Test'

          start: 'foo'

          states:
            - state: 'foo'
              actions:
                - action: 'foo'
                  url: 'http://www.google.com.br'
        `

        createTestStepThatDoesntThrowAnError(
          'DEBUG:START_PARSING_YAML',
          'DEBUG:FINISHED_PARSING_YAML',
          yaml
        )

      })

      describe('Tests the states & actions parse step', () => {
        const yaml = `
          name: 'Test'

          start: 'foo'

          states:
            - state: 'foo'
              actions:
                - action: 'foo'
                  url: 'http://www.google.com.br'
        `

        createTestStepThatDoesntThrowAnError(
          'DEBUG:START_PARSING_STATES',
          'DEBUG:FINISHED_PARSING_STATES',
          yaml
        )
      })

      describe('Tests the events initialization', () => {
        const yaml = `
          name: 'Test'

          start: 'foo'

          states:
            - state: 'foo'
              actions:
                - action: 'foo'
                  url: 'http://www.google.com.br'
        `

        createTestStepThatDoesntThrowAnError(
          'DEBUG:START_PARSING_EVENTS',
          'DEBUG:FINISHED_PARSING_EVENTS',
          yaml
        )
      })

      // describe('Tests the complete initialization', () => {

      // })
    })
  }) 
})
