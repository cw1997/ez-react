import React from './React'

describe('test ez-react', () => {
  // use stringify to compare because virtual dom has event handler function
  test('test React.createElement by stringify', () => {
    expect(
      JSON.stringify(
        React.createElement(
          'a',
          {
            onClick: () => alert(1),
          },
          React.createElement('div', {}, 123, 'second child'),
          React.createElement('span', {}, false, 'this is span', true),
        )
      )
    ).toBe(
      JSON.stringify(
        {
          tagName: 'a',
          attributes: { onClick: () => alert(1)},
          children: [
            { tagName: 'div', attributes: {}, children: [123, 'second child'] },
            { tagName: 'span', attributes: {}, children: [false, 'this is span', true] }
          ]
        }
      )
    );
  });
});
