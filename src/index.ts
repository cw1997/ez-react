import createElement from "./createElement";
import Component, {create, setProps, unmount} from "./Component";
import {FC} from "./FC";

export type ReactComponent<P, S> = FC<P> | Component<P, S>;

export type Key = string | number

export interface ReactHTMLElement extends HTMLElement {
  key?: Key
  _node?: Node
}

export interface ReactTextElement extends Text {
}

export interface ReactComponentElement<P, S> extends ReactHTMLElement {
  _instance?: Component<P, S>
}

export type ReactElement = ReactHTMLElement | ReactTextElement | ReactComponentElement<any, any>

export type VirtualTextNode = number | string | boolean
export type VirtualNode = VirtualDOM | VirtualTextNode

export interface VirtualDOM {
  tagName: string | ReactComponent<any, any>
  attributes?: ReactComponentElement<any, any>
  children?: VirtualNode[]
  key?: Key
}


export default {createElement, Component};
export {Component, FC, create, setProps, unmount};
