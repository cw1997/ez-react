import React from '@cw1997/ez-react'
import ReactDOM from './index'

type eventHandlers = {name: string, func?: (...any: any) => any}[]

const testReactDom = (jsx, expectedInnerHtml, eventHandlers?: eventHandlers) => {
  const container = document.createElement('div');
  ReactDOM.render(jsx, container);
  const {innerHTML} = container;
  expect(innerHTML).toBe(expectedInnerHtml);
  const innerDiv = container.querySelector<HTMLDivElement>('#my-div');
  if (innerDiv && eventHandlers && eventHandlers.length > 0) {
    eventHandlers.forEach((eventHandler, eventHandlersIndex) => {
      expect(innerDiv[eventHandler.name]).not.toBeNull();
    })
  }
};

describe('ez-react-dom', () => {
  describe('function component', () => {
    test('StrJsx', () => {
      const StrJsx = 'hello ez-react-dom !';
      const expectedInnerHtml = 'hello ez-react-dom !';
      testReactDom(StrJsx, expectedInnerHtml);
    });

    test('StrJsxWithHtmlTagAndSpecialChar', () => {
      const StrJsxWithHtmlTagAndSpecialChar = 'author: cw1997<867597730@qq.com> \\ <a href="http://www.changwei.me"></a>';
      const expectedInnerHtml = 'author: cw1997&lt;867597730@qq.com&gt; \\ &lt;a href="http://www.changwei.me"&gt;&lt;/a&gt;';
      testReactDom(StrJsxWithHtmlTagAndSpecialChar, expectedInnerHtml);
    });

    test('NumJsx', () => {
      const StrJsx = 1997;
      const expectedInnerHtml = '1997';
      testReactDom(StrJsx, expectedInnerHtml);
    });

    test('BoolJsx', () => {
      const BoolJsx = true;
      const expectedInnerHtml = 'true';
      testReactDom(BoolJsx, expectedInnerHtml);
    });

    test('StrJsx', () => {
      const StrJsx = 'str';
      const expectedInnerHtml = 'str';
      testReactDom(StrJsx, expectedInnerHtml);
    });

    test('SimpleJsx', () => {
      const SimpleJsx = <span>world</span>;
      const expectedInnerHtml = '<span>world</span>';
      testReactDom(SimpleJsx, expectedInnerHtml);
    });

    test('SimpleJsxWithAttributes', () => {
      const SimpleJsxWithAttributes = <span id="name">cw1997</span>;
      const expectedInnerHtml = '<span id="name">cw1997</span>';
      testReactDom(SimpleJsxWithAttributes, expectedInnerHtml);
    });

    test('ComplicatedJsxWithProperties', () => {
      const ComplicatedJsxWithProperties = (
        <div
          id="my-div"
          data-info="my-data-info"
        >
          hello{' '}{(<span>world</span>)}!
        </div>
      );
      const expectedInnerHtml = '<div id="my-div" data-info="my-data-info">hello <span>world</span>!</div>';
      testReactDom(ComplicatedJsxWithProperties, expectedInnerHtml);
    });

    test('FunctionComponentWithProperties', () => {
      const FunctionComponentWithProperties = (props: { name: string }) => <span id="name">{props.name}</span>;
      const expectedInnerHtml = '<span id="name">cw1997</span>';
      testReactDom(<FunctionComponentWithProperties name={'cw1997'} />, expectedInnerHtml);
    });

    test('ComplicatedJsxWithFunctionComponent', () => {
      const FunctionComponentWithProperties = (props: { name: string }) => <span id="name">{props.name}</span>;
      const ComplicatedJsxWithFunctionComponent = (props: { name: string }) => (
        <div
          id="my-div"
          data-info="my-data-info"
        >
          hello{' '}<FunctionComponentWithProperties name={name}/>!
        </div>
      );
      const expectedInnerHtml = '<div id="my-div" data-info="my-data-info">hello <span id="name"></span>!</div>';
      testReactDom(<ComplicatedJsxWithFunctionComponent name={'cw1997'} />, expectedInnerHtml);
    });

    test('ComplicatedJsxWithFunctionComponentAndEventHandler', () => {
      const FunctionComponentWithProperties = (props: { name: string }) => <span id="name">{props.name}</span>;
      const MouseMoveEventHandler = (event: MouseEvent, action: 'enter' | 'out') => {
        console.info(`mouse move ${action} the NameComponent`);
      };
      const ComplicatedJsxWithFunctionComponentAndEventHandler = (props: { name: string }) => (
        <div
          id="my-div"
          style={{backgroundColor: 'lightblue'}}
          onClick={() => alert('hello world')}
          onMouseEnter={(event) => MouseMoveEventHandler(event, 'enter')}
          onMouseOut={(event) => MouseMoveEventHandler(event, 'out')}
        >
          hello <FunctionComponentWithProperties name={name}/>!
        </div>
      );
      const expectedInnerHtml = '<div id="my-div" style="background-color: lightblue;">hello <span id="name"></span>!</div>';
      testReactDom(<ComplicatedJsxWithFunctionComponentAndEventHandler name={'cw1997'} />, expectedInnerHtml, [
        {name: 'onClick'},
        {name: 'onMouseEnter'},
        {name: 'onMouseOut'},
      ]);
    });

    test('ComplicatedJsxWithFunctionComponentAndSpecialProperties', () => {
      const FunctionComponentWithProperties = (props: { name: string }) => <span id="name">{props.name}</span>;
      const ComplicatedJsxWithFunctionComponentAndSpecialProperties = (props: { name: string }) => (
        <div
          style={{backgroundColor: 'lightblue'}}
          // onclick={() => alert('hello world')}
          className="my-class"
        >
          hello <FunctionComponentWithProperties name={name}/>!
          <hr/>
          <label htmlFor="name-input">
            <input id="name-input" tabIndex={0}/>
          </label>
        </div>
      );
      const expectedInnerHtml = '<div style="background-color: lightblue;" class="my-class">hello <span id="name"></span>!<hr><label for="name-input"><input id="name-input" tabindex="0"></label></div>';
      testReactDom(<ComplicatedJsxWithFunctionComponentAndSpecialProperties name={'cw1997'} />, expectedInnerHtml);
    });

    test('ComplicatedJsxWithFunctionComponentAndStyleProperties', () => {
      const FunctionComponentWithProperties = (props: { name: string }) => <span id="name">{props.name}</span>;
      const ComplicatedJsxWithFunctionComponentAndSpecialProperties = (props: { name: string }) => (
        <div
          style="background-color: lightblue;"
          // onclick={() => alert('hello world')}
          className="my-class"
        >
          hello <FunctionComponentWithProperties name={name}/>!
          <hr/>
          <label htmlFor="name-input">
            <input id="name-input" tabIndex={0}/>
          </label>
        </div>
      );
      const expectedInnerHtml = '<div style="background-color: lightblue;" class="my-class">hello <span id="name"></span>!<hr><label for="name-input"><input id="name-input" tabindex="0"></label></div>';
      testReactDom(<ComplicatedJsxWithFunctionComponentAndSpecialProperties name={'cw1997'} />, expectedInnerHtml);
    });

    test('ComplicatedJsxWithFunctionComponentAndEmptyStyleProperties', () => {
      const FunctionComponentWithProperties = (props: { name: string }) => <span id="name">{props.name}</span>;
      const ComplicatedJsxWithFunctionComponentAndEmptyStyleProperties = (props: { name: string }) => (
        <div
          style={false}
          className="my-class"
        >
          hello <FunctionComponentWithProperties name={name}/>!
          <hr/>
          <label htmlFor="name-input">
            <input id="name-input" tabIndex={0}/>
          </label>
        </div>
      );
      const expectedInnerHtml = '<div class="my-class">hello <span id="name"></span>!<hr><label for="name-input"><input id="name-input" tabindex="0"></label></div>';
      testReactDom(<ComplicatedJsxWithFunctionComponentAndEmptyStyleProperties name={'cw1997'} />, expectedInnerHtml);
    });
  });

  describe('class  component', () => {
    test('ClassComponent', () => {
      interface IProps {
        name: string
        sex: 'male' | 'female'
        // bir: Date
      }
      interface IState {
        // count?: number
      }
      class JsxWithClassComponent extends React.Component<IProps, IState> {
        render() {
          const {name, sex} = this.props;
          return (
            <span>{name} - {sex}</span>
          )
        }
      }

      const expectedInnerHtml = '<span>cw1997 - male</span>';
      testReactDom(<JsxWithClassComponent name={'cw1997'} sex={'male'}/>, expectedInnerHtml);
    });

    test('ClassComponentWithState', () => {
      interface IProps {
        name: string
        sex: 'male' | 'female'
        // bir: Date
      }
      interface IState {
        birthdayYear: number
      }
      class ClassComponentWithState extends React.Component<IProps, IState> {
        constructor(props) {
          super(props);
          this.state = {
            birthdayYear: 1997,
          }
        }
        render() {
          const {name, sex} = this.props;
          const {birthdayYear} = this.state;
          return (
            <span>{name} - {sex} - {birthdayYear}</span>
          )
        }
      }

      const expectedInnerHtml = '<span>cw1997 - male - 1997</span>';
      testReactDom(<ClassComponentWithState name={'cw1997'} sex={'male'}/>, expectedInnerHtml);
    });

    test('ClassComponentWithInnerClassComponent', () => {
      function InnerComponent(props: {}) {
        return (
          <div id="inner-component">
            inner-component
          </div>
        )
      }

      interface IProps {
        name: string
        sex: 'male' | 'female'
        // bir: Date
      }
      interface IState {
        birthdayYear: number
      }
      class ClassComponentWithInnerComponent extends React.Component<IProps, IState> {
        constructor(props) {
          super(props);
          this.state = {
            birthdayYear: 1997
          }
        }
        render() {
          const {name, sex} = this.props;
          const {birthdayYear} = this.state;
          return (
            <div id="my-div">
              <span>{name} - {sex}</span>
              <hr/>
              <InnerComponent/>
            </div>
          )
        }
      }

      const expectedInnerHtml = '<div id="my-div"><span>cw1997 - male</span><hr><div id="inner-component">inner-component</div></div>';
      testReactDom(<ClassComponentWithInnerComponent name={'cw1997'} sex={'male'}/>, expectedInnerHtml);
    });

    test('ClassComponentWithInnerClassComponentWithProps', () => {
      function InnerComponent(props: {bir: number}) {
        return (
          <div id="inner-component">
            {props.bir}
          </div>
        )
      }

      interface IProps {
        name: string
        sex: 'male' | 'female'
        // bir: Date
      }
      interface IState {
        birthdayYear: number
      }
      class ClassComponentWithInnerClassComponentWithProps extends React.Component<IProps, IState> {
        constructor(props) {
          super(props);
          this.state = {
            birthdayYear: 1997
          }
        }
        render() {
          const {name, sex} = this.props;
          const {birthdayYear} = this.state;
          return (
            <div id="my-div">
              <span>{name} - {sex}</span>
              <hr/>
              <InnerComponent bir={birthdayYear}/>
            </div>
          )
        }
      }

      const expectedInnerHtml = '<div id="my-div"><span>cw1997 - male</span><hr><div id="inner-component">1997</div></div>';
      testReactDom(<ClassComponentWithInnerClassComponentWithProps name={'cw1997'} sex={'male'}/>, expectedInnerHtml);
    });

    test('ClassComponentWithInnerClassComponentWithChildren', () => {
      function InnerComponent(props: any) {
        return (
          <div id="inner-component">
            {props.children}
          </div>
        )
      }

      interface IProps {
        name: string
        sex: 'male' | 'female'
        // bir: Date
      }
      interface IState {
        birthdayYear: number
      }
      class ClassComponentWithInnerClassComponentWithChildren extends React.Component<IProps, IState> {
        constructor(props) {
          super(props);
          this.state = {
            birthdayYear: 1997
          }
        }
        render() {
          const {name, sex} = this.props;
          const {birthdayYear} = this.state;
          return (
            <div id="my-div">
              <span>{name} - {sex}</span>
              <hr/>
              <InnerComponent>{name}-{sex}-{birthdayYear}</InnerComponent>
            </div>
          )
        }
      }

      // const expectedInnerHtml = '<div id="my-div"><span>cw1997 - male</span><hr><div id="inner-component">1997</div></div>';
      const expectedInnerHtml = '<div id="my-div"><span>cw1997 - male</span><hr><div id="inner-component">cw1997-male-1997</div></div>';
      testReactDom(<ClassComponentWithInnerClassComponentWithChildren name={'cw1997'} sex={'male'}/>, expectedInnerHtml);
    });

  });

  describe('test diff', () => {
    test('Counter', () => {
      class Counter extends React.Component<{}, {count: number}> {
        constructor() {
          super();
          this.state = {
            count: 0,
          }
        }
        add() {
          const count = this.state.count + 1
          this.setState({count})
        }
        render() {
          return (
              <div className="Counter">
                {this.state.count}
                <button onClick={() => this.add()}>add</button>
              </div>
          )
        }
      }
      const expectedInnerHtml = '<div class="Counter">0<button>add</button></div>';
      testReactDom(<Counter/>, expectedInnerHtml);
    })

    test('WithKey', () => {
      class WithKey extends React.Component<{}, {list: number[]}> {
        constructor() {
          super();
          this.state = {
            list: [0, 1, 2, 3],
          }
        }
        add() {
          const {list} = this.state
          list.push(Math.random())
          this.setState({list})
        }
        render() {
          const {list} = this.state
          return (
              <div className="WithKey">
                <ul>
                  {list.map(v => <li key={v}>{v}</li>)}
                </ul>
                <button onClick={() => this.add()}>add</button>
              </div>
          )
        }
      }
      const expectedInnerHtml = '<div class="WithKey"><ul><li>0</li><li>1</li><li>2</li><li>3</li></ul><button>add</button></div>';
      testReactDom(<WithKey/>, expectedInnerHtml);
    })
  });
});
