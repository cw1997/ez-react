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
    render(this, this.props, nextState);
    return nextState;
  }
  public abstract render();
  public componentWillMount() {};
  /**
   * @deprecate
   * @param nextProps
   */
  public componentWillReceiveProps?(nextProps: P);
  public getDerivedStateFromProps?(nextProps: P, nextState: S);
  public shouldComponentUpdate(nextProps: P, nextState: S) {return true};
  /**
   * @deprecate
   * @param nextProps
   * @param nextState
   */
  public componentWillUpdate?(nextProps: P, nextState: S);
  public getSnapshotBeforeUpdate?(prevProps: P, prevState: S);
  public componentDidUpdate?(prevProps: P, prevState: S, snapshot?);
  public componentDidMount?();
  public componentWillUnmount?();
  public componentDidCatch?(error, info);
}

export function create<P, S>(component: Function | ObjectConstructor, properties: P): Component<P, S> {
  let instance: Component<P, S>;
  // class component
  if (Component.isPrototypeOf(component)) {
    instance = new (component as ObjectConstructor)(properties) as Component<P, S>;
    // function component
  } else {
    class FunctionComponent extends Component<P, S> {
      render() {
        return (component as Function)(this.props)
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

  render(component, properties, component.state);
}

export function render<P, S>(component: Component<P, S>, nextProps: P, nextState: S) {
  const prevProps: P = component.props;
  const prevState: S = component.state;

  if (component.node) {
    if (component.getDerivedStateFromProps) {
      component.getDerivedStateFromProps(nextProps, nextState);
    } else if (component.componentWillUpdate) {
      component.componentWillUpdate(nextProps, nextState);
    }
  }

  if (!component.shouldComponentUpdate(nextProps, nextState)) {
    return;
  }

  component.props = nextProps;
  component.state = nextState;
  const newNode = ReactDOM._render(component.render());

  if (component.node) {
    if (component.getSnapshotBeforeUpdate) {
      const snapshot = component.getSnapshotBeforeUpdate(prevProps, prevState);
      component.componentDidUpdate(prevProps, prevState, snapshot);
    } else if (component.componentDidUpdate) {
      component.componentDidUpdate(prevProps, prevState);
    }
  }

  const oldNode = component.node;
  oldNode?.parentNode?.replaceChild(newNode, oldNode);

  component.componentDidMount?.();

  component.node = newNode;
}
