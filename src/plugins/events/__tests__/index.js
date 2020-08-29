const plugin = require('../index');

describe('eventbuzz', () => {
  describe(`Tests the 'emmit' && 'on' function`, () => {
    test('Should emmit an event and should recieve it', (done) => {
      const { on, emmit } = plugin.setup();
      const event = 'event:foo';

      on(event, () => done())

      emmit(event)
    })

    test('Should recieve an object with `event` and `payload` properties as the data passed to the event callback function', (done) => {
      expect.assertions(2)

      const { on, emmit } = plugin.setup();
      const event = 'event:foo';
      on(event, (event, payload) => {
        expect(event !== undefined).toBeTruthy()
        expect(payload !== undefined).toBeTruthy()
        done()
      })

      emmit('event:foo')
    })

    test('Should recieve the same payload as sended', (done) => {
      expect.assertions(1)

      const { on, emmit } = plugin.setup();
      const event = 'event:foo';
      const payload = 'bar'

      on(event, (recievedPayload) => {
        expect(recievedPayload).toMatch(payload)
        done()
      })

      emmit('event:foo', payload)
    })

    test('Should listen to all events with the `*` event handler', (done) => {
      const { on, emmit } = plugin.setup();

      on('*', () => done())

      emmit('event:foo')
    })
  })
})