import createElement from "./createElement";
import {Component, FunctionComponent, create, setProps, unmount} from "./Component";

export default {createElement, Component, createRef};
export {FunctionComponent, create, setProps, unmount};

export interface FC<P> {
  (props: P): VirtualNode
}

export type ReactComponent<P, S> = FC<P> | Component<P, S>;

export type Key = string | number

export type EventHandler = any

export interface VirtualDOMAttributesWithoutEventHandler extends Element {
  key: Key
}
export type VirtualDOMAttributes = VirtualDOMAttributesWithoutEventHandler | EventHandler

export interface ReactHTMLElement extends Element {
}

export interface ReactTextElement extends Node {
}

export interface ReactComponentElement<P, S> extends ReactHTMLElement {
  _instance?: Component<P, S>
  _node?: Node
}

export interface ReactElement extends ReactHTMLElement {
  _instance?: Component<any, any>
  _node?: Node
}

export interface ReactCommonNode extends Node {
  _instance?: Component<any, any>
  _node?: Node
}
export interface ReactTextNode extends ReactCommonNode, Text {

}
export interface ReactHTMLNode extends ReactCommonNode {

}
export type ReactNode = ReactTextNode | ReactHTMLNode

export type VirtualTextNode = number | string | boolean
export type VirtualNode = VirtualDOM | VirtualTextNode

export interface VirtualCommonDOM {
  // tagName: string | ReactComponent<any, any>
  // attributes?: ReactComponentElement<any, any>
  children?: VirtualNode[]
  key?: Key
}

export interface VirtualHTMLDOM extends VirtualCommonDOM {
  tagName: string
  attributes: VirtualDOMAttributes
}

export interface VirtualComponentDOM extends VirtualCommonDOM {
  tagName: ReactComponent<any, any>
  attributes: VirtualDOMAttributes
}

export interface VirtualDOM extends VirtualCommonDOM {
  tagName: VirtualHTMLDOM['tagName'] | VirtualComponentDOM['tagName']
  attributes: VirtualHTMLDOM['attributes'] | VirtualComponentDOM['attributes']
}

// Ref
export class Ref {
  // current type is any, so it can store anything.
  current: any
}

function createRef(): Ref {
  return new Ref();
}
