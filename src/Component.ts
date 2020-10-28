import ReactDOM from 'ez-react-dom';

export default abstract class Component<P, S> {
  public node?: HTMLElement | Text;
  public props: P;
  public state: S;
  public constructor(props?: P) {
    this.props = props;
  }
  public setState(updateState: any) {
    const nextState: S = {...this.state, ...updateState};
    this.state = nextState;
    render(this);
    return nextState;
  }
  public abstract render();
  public componentWillMount() {};
  /**
   * @deprecate
   * @param nextProps
   */
  public componentWillReceiveProps(nextProps: P) {};
  public getDerivedStateFromProps(nextProps: P, nextState: S) {};
  public shouldComponentUpdate(nextProps: P, nextState: S) {return true};
  /**
   * @deprecate
   * @param nextProps
   * @param nextState
   */
  public componentWillUpdate(nextProps: P, nextState: S) {};
  public getSnapshotBeforeUpdate(prevProps: P, prevState: S) {};
  public componentDidUpdate(prevProps: P, prevState: S, snapshot?) {};
  public componentDidMount() {};
  public componentWillUnmount() {};
  public componentDidCatch(error, info) {};
}

export function create<P, S>(component: any, properties: P): Component<P, S> {
  let instance: Component<P, S>;
  // class component
  if (Component.isPrototypeOf(component)) {
    instance = new component(properties);
    // function component
  } else {
    class FunctionComponent extends Component<P, S> {
      render() {
        return component(this.props)
      };
    }
    instance = new FunctionComponent(properties);
  }
  return instance;
}

export function setProps<P, S>(component: Component<P, S>, properties: P) {
  if (component.node) {
    component.componentWillReceiveProps(properties);
  } else {
    component.componentWillMount();
  }

  component.props = properties;
  render(component);
}

export function render<P, S>(component: Component<P, S>) {
  const nextProps: P = component.props;
  const nextState: S = component.state;
  if (component.node) {
    component.componentWillUpdate(nextProps, nextState);
  }

  if (!component.shouldComponentUpdate(nextProps, nextState)) {
    return;
  }

  const newNode = ReactDOM._render(component.render());

  component.componentDidUpdate(nextProps, nextState);

  const oldNode = component.node;
  if (oldNode) {
    if (oldNode.parentNode) {
      oldNode.parentNode.replaceChild(newNode, oldNode);
    }
  }

  component.componentDidMount();

  component.node = newNode;
}
