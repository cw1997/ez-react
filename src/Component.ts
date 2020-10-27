import {FC, ReactComponent, VirtualDOM} from "./index";
import ReactDOM from 'ez-react-dom';

export interface IClassComponent<P, S> {
  // constructor: Function
  props: P;
  setState(updateState: any): S;
  componentWillMount?();
  componentWillReceiveProps?(props: P);
  componentWillUpdate?();
  componentDidUpdate?();
  componentDidMount?();
  componentWillUnmount?();
  render(): VirtualDOM;
  node?: HTMLElement | Text
}

export default abstract class Component<P, S> implements IClassComponent<P, S> {
  public props: P;
  protected state: S;
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
}

export function create<P, S>(component: any, properties: P): IClassComponent<P, S> {
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

export function setProps(component: IClassComponent<any, any>, properties) {
  if (component.node) {
    if (component.componentWillReceiveProps) {
      component.componentWillReceiveProps(properties);
    }
  } else {
    if (component.componentWillMount) {
      component.componentWillMount();
    }
  }
  component.props = properties;
  render(component);
}

export function render(component: IClassComponent<any, any>) {
  if (component.node && component.componentWillUpdate) {
    component.componentWillUpdate();
  }

  const newNode = ReactDOM._render(component.render());

  if (component.componentDidUpdate) {
    component.componentDidUpdate();
  }

  const oldNode = component.node;
  // console.log('newNode', newNode, 'oldNode', oldNode, );
  if (oldNode) {
    if (oldNode.parentNode) {
      oldNode.parentNode.replaceChild(newNode, oldNode);
    }
  }

  if (component.componentDidMount) {
    component.componentDidMount();
  }

  component.node = newNode;
}
