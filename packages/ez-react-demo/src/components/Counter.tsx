import React from '@cw1997/ez-react';

//import "./Counter.sass"

interface IProps {
  name: string
  sex: 'male' | 'female'
  // bir: Date
}

interface IState {
  count: number
  jsx: any
}

export default class Counter extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const count = 0
    const jsx = this.getJsxByCountNumberParity(count)
    this.state = {
      count,
      jsx,
    }
  }

  componentWillReceiveProps(props) {
    console.log('componentWillReceiveProps', props);
  }

  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  //addCount = () => {
  //  const {count} = this.state;
  //  // console.log(`current state: ${count}, next state: ${count + 1}`);
  //  this.setState({count: count + 1});
  //};
  /**
   * use auto binding
   **/
  addCount() {
    const {count} = this.state
    const nextCount = count + 1
    console.log('addCount "this" is: ', this);
    console.log('the "this" variable is auto-binding by @cw1997/ez-react');
    const jsx = this.getJsxByCountNumberParity(nextCount)
    this.setState({count: nextCount, jsx});
  }

  getJsxByCountNumberParity(count) {
    const {EvenNumber, OddNumber} = this
    return count % 2 === 0 ?
      <EvenNumber>click count is {count} , it is EvenNumber</EvenNumber> :
      <OddNumber>click count is {count} , it is OddNumber</OddNumber>;
  }

  EvenNumber (subProps) {
    return <div id="even">
      start -{' '}{subProps.children}{' '}- end
    </div>
  }
  OddNumber (subProps) {
    return <div id="odd">
      {subProps.children} ,
      TODO: bug !! when component re-render,
      children render incomplete,
      as you see, this line will disappear after you click button.
    </div>
  }
  render() {
    const {name, sex} = this.props;
    const {count, jsx} = this.state;
    return (
      <div id="my-div-id" class="my-div-cls">
        <h1>
          {name} - {sex}
        </h1>
        <p>
          {count}
        </p>
        <div>
          <button id="btn" onClick={this.addCount}>count: {count}</button>
        </div>
        <div>
          <div>The following components will change by the count number changes</div>
          {jsx}
        </div>
      </div>
    )
  }
}
