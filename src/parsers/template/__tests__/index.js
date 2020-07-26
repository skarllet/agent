const parser = require('../index')

describe('Template string parser', () => {
  test('should replace the template in the string with the value provided in the object', () => {
    const string = `
      foo bar {{ baz }}
      {{ foo }}
    `

    const object = {
      foo: 'foo',
      baz: 'baz'
    }

    const parsed = parser(string, object)

    expect(parsed).toMatch(new RegExp(object.foo, 'g'))
    expect(parsed).toMatch(new RegExp(object.baz, 'g'))
  })
})
