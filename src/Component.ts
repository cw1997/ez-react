import ReactDOM from 'ez-react-dom';
import {ReactComponentElement, ReactElement} from "./index";

export default abstract class Component<P, S> {
  public _node?: Node;
  public props: P;
  public state: S;
  public constructor(props?: P) {
    this.props = props;
  }
  public setState(updateState: Partial<S>) {
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
    autoBindThis(component as ObjectConstructor, instance);
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

export function setProps<P, S>(instance: Component<P, S>, properties: P) {
  if (instance._node) {
    instance.componentWillReceiveProps?.(properties);
  } else {
    instance.componentWillMount?.();
  }

  render(instance, properties, instance.state);
}

export function render<P, S>(instance: Component<P, S>, nextProps: P, nextState: S) {
  const prevProps: P = instance.props;
  const prevState: S = instance.state;
  const oldNode = instance._node;

  if (oldNode) {
    if (instance.getDerivedStateFromProps) {
      instance.getDerivedStateFromProps(nextProps, nextState);
    } else {
      instance.componentWillUpdate?.(nextProps, nextState);
    }
  }

  if (!instance.shouldComponentUpdate(nextProps, nextState)) {
    return;
  }

  instance.props = nextProps;
  instance.state = nextState;
  const newVirtualNode = instance.render();
  const newNode = ReactDOM._diffRender(oldNode, newVirtualNode);
  newNode._instance = instance;
  instance._node = newNode

  if (oldNode) {
    if (instance.getSnapshotBeforeUpdate) {
      const snapshot = instance.getSnapshotBeforeUpdate(prevProps, prevState);
      instance.componentDidUpdate?.(prevProps, prevState, snapshot);
    } else if (instance.componentDidUpdate) {
      instance.componentDidUpdate(prevProps, prevState);
    }
  }

  instance.componentDidMount?.();
}

export function unmount<P, S>(instance: Component<P, S>) {
  instance.componentWillUnmount?.();
}

function autoBindThis<P, S>(component: ObjectConstructor, instance: Component<P, S>) {
  const componentKeys = Reflect.ownKeys(component.prototype);
  componentKeys.forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}
