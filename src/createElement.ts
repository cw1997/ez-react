import {VirtualDOM} from "./index";

export default function createElement(
  tagName: VirtualDOM['tagName'],
  attributes?: VirtualDOM['attributes'],
  ...children: VirtualDOM['children']
): VirtualDOM {
    return {
      tagName,
      attributes,
      children,
    }
}
