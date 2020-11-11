import createElement from "./createElement";
import Component, {create, setProps, unmount} from "./Component";
import {FC} from "./FC";

export type ReactComponent<P, S> = FC<P> | Component<P, S>;

export type Key = string | number

export interface ReactHTMLElement extends Element {
  key?: Key
}

export interface ReactTextElement extends Text {
}

export interface ReactComponentElement<P, S> extends ReactHTMLElement {
  _instance?: Component<P, S>
  _node?: Node
}

export type ReactElement = ReactComponentElement<any, any>

export type VirtualTextNode = number | string | boolean
export type VirtualNode = VirtualHTMLDOM | VirtualComponentDOM | VirtualTextNode

export interface VirtualCommonDOM {
  // tagName: string | ReactComponent<any, any>
  // attributes?: ReactComponentElement<any, any>
  children?: VirtualNode[]
  key?: Key
}

export interface VirtualHTMLDOM extends VirtualCommonDOM {
  tagName: string
  attributes?: HTMLElement
}

export interface VirtualComponentDOM extends VirtualCommonDOM {
  tagName: ReactComponent<any, any>
  attributes?: ReactComponentElement<any, any>
}


export default {createElement, Component};
export {Component, FC, create, setProps, unmount};
