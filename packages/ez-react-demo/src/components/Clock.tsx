import React from '@cw1997/ez-react';

//import "./Clock.sass"

interface IProps {
  children: '',
}
interface IState {
  now: string
}

export default class Clock extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      now: String(new Date()),
    }
  }

  private intervalId;

  componentWillMount() {
    console.log('componentWillMount');
    this.intervalId = setInterval(() => {
      const now = String(new Date());
      this.setState({
        now
      });
    }, 1000);
    console.log('setInterval', this.intervalId);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearInterval(this.intervalId);
    console.log('clearInterval(this.intervalId)', this.intervalId);
  }

  render() {
    const {children} = this.props;
    const {now} = this.state;
    return (
      <div>
        <h1>{children}</h1>
        <div>now: {now}</div>
      </div>
    )
  }
}

