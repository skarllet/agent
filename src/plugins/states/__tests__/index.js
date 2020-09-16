describe('states plugin', () => {
  const plugins = require('@skarllet/plugins').create()

  beforeEach(async () => {
    await plugins.register(require('../../events'))
    await plugins.register(require('../../actions'))
    await plugins.register(require('../index'))
  })

  describe('Checks the return of the "setup" function', () => {
    test('The setup function should return an Object', () => {
      const sm = plugins.use('states');
      expect(typeof sm).toBe('object')
    });
  
    test('The object should have the properties: on, register, change, states', () => {
      const sm = plugins.use('states');

      expect(sm).toHaveProperty('register');
      expect(sm).toHaveProperty('change');
    });
  });

  describe('Tests the functionality of the setup State Machine', () => {
    const plugins = require('@skarllet/plugins').create()

    beforeEach(async () => {
      await plugins.register(require('../../events'))
      await plugins.register(require('../../actions'))
      await plugins.register(require('../index'))
    })

    test('the state "state:foo" should be called one time', () => {
      // setup the State Machine instance,
      const sm = plugins.use('states');

      // Define the states
      const cbA = jest.fn(async ({ change }) => change('state:bar'))
      const cbB = jest.fn(async () => {})

      sm.register('state:foo', cbA)
      sm.register('state:bar', cbB)

      // Bootstrap the events by changing the first state
      sm.change('state:foo');

      expect(cbA).toHaveBeenCalled();
    });

    test('the state "state:bar" should be called one time', () => {
      // setup the State Machine instance,
      const sm = plugins.use('states');

      // Define the states
      const cbA = jest.fn(async ({ change }) => change('state:bar'))
      const cbB = jest.fn(async () => {})

      sm.register('state:foo', cbA)
      sm.register('state:bar', cbB)

      // Bootstrap the events by changing the first state
      sm.change('state:foo');

      expect(cbB).toHaveBeenCalled();
    });

    test('After exec all states should emmit a finish event one time', () => {
      // setup the State Machine instance,
      const sm = plugins.use('states');
      const events = plugins.use('events');

      const cb = jest.fn()

      events.on('state:finish', cb)

      sm.register('state:foo', ({ change }) => change(`state:bar`))
      sm.register('state:bar', () => {})

      // Bootstrap the events by changing the first state
      sm
        .change('state:foo')
        .then(() => {
          expect(cb).toHaveBeenCalledTimes(1)
        });
    });
  });
});