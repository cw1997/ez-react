import createElement from "./createElement";
import Component, {create, setProps, unmount} from "./Component";
import {FC} from "./FC";

export type ReactComponent<P, S> = FC<P> | Component<P, S>;

export interface ReactElement extends Node {
  key?: string | number
  _node?: Node
}

export interface ComponentElement<P, S> extends ReactElement {
  _instance?: Component<P, S>
}

export type VirtualTextNode = number | string | boolean
export type VirtualNode = VirtualDOM | VirtualTextNode

export interface VirtualDOM {
  tagName: string | ReactComponent<any, any>
  attributes?: ComponentElement<any, any>
  children?: VirtualNode[]
}


export default {createElement, Component};
export {Component, FC, create, setProps, unmount};
