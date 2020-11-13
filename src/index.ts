import createElement from "./createElement";
import Component from "./Component";
import {FC} from "./FC";

export type ReactComponent<P, S> = FC<P> | Component<P, S>;

export type VirtualDOM = {
  tagName: string | ReactComponent<any, any>
  attributes?: Partial<HTMLElement>
  children?: Array<VirtualDOM | number | string | boolean>
}

export default {createElement, Component};
export {Component, FC};
