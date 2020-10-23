import {VirtualDOM} from "./index";

export default class React {
  public static createElement(tagName: string, attributes?: HTMLElement, ...children: VirtualDOM[]): VirtualDOM {
    return {
      tagName,
      attributes,
      children,
    }
  }
}
