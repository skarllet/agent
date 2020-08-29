const agent = require('../index')

describe('Tests the exposed return of the module', () => {
  test('should have one propety', () => {
    expect(Object.entries(agent).length).toBe(1)
  })

  test('should have the `create` propety', () => {
    expect(agent).toHaveProperty('create')
  })
})

describe('Agent', () => {
  describe(`Tests the exposed properties in the creation handler function, 'agent.create(<handler>)'`, () => {
    test('should call the handler function', done => {
      const handler = () => done()
      agent.create(handler)
    })
    
    test('should have the propeties: plugin, state, action and events', done => {
      agent.create(instance => {
        expect(instance).toHaveProperty('events')
        expect(instance).toHaveProperty('states')
        expect(instance).toHaveProperty('actions')
        expect(instance).toHaveProperty('plugins')
        expect(Object.keys(instance).length).toBe(4)
        done()
      })
    })
  })

  describe(`Tests the definition of the states and the properties of the handler function, 'instance => instance.states.register(<name>, <handler>)'`, () => {
    test(`should have call the state handler function when the state changes`, done => {
      agent.create(instance => {
        const stateHandler = () => done()

        instance.states.register('state:teste', stateHandler)

        instance.states.change('state:teste')
      })
    })

    test(`should have the properties: plugin, action and change`, done => {
      agent.create(instance => {
        instance.states.register('state:teste', state => {
          expect(state).toHaveProperty('change')
          expect(state).toHaveProperty('actions')
          done()
        })

        instance.states.change('state:teste')
      })
    })
  })

  describe(`Tests the definition and use of actions`, () => {
    test(`should call a action`, done => {
      agent.create(instance => {
        const actionHandler = jest.fn()

        // Register a action to be used in all states
        instance.actions.register('dummy:action', actionHandler)

        // Register an state
        instance.states.register('state:teste',async state => {
          await state.actions.dispatch('dummy:action')

          expect(actionHandler).toHaveBeenCalled()
          done()
        })

        instance.states.change('state:teste')
      })
    })
  })


})
