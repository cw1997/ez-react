import {
  create,
  setProps,
  unmount,
  ReactElement,
  ReactNode,
  VirtualComponentDOM,
  VirtualHTMLDOM,
  VirtualNode,
  VirtualTextNode,
  FunctionComponent, FC
} from "@cw1997/ez-react";


export default class ReactDOM {
  public static render(virtualDom: VirtualNode, container: HTMLElement, clearBeforeRender: boolean = true) {
    //  if you want to erase container when call ReactDOM.render, please uncomment the next line.
    if (clearBeforeRender) {
      container.innerHTML = '';
    }
    const emptyNode = document.createElement('div');
    const oldTrueDom = container.appendChild(emptyNode);
    const realDOM = this._diffRender(oldTrueDom, virtualDom);
    if (realDOM) {
      container.innerHTML = null;
      container.appendChild(realDOM);
    }
  }

  // TODO: require correct type of parameter 'key' (keyof HTMLElement and React special attribute key)
  public static _setDomAttribute(element: HTMLElement, key: string, value: any): void {
    /**
     * reference: https://reactjs.org/docs/dom-elements.html
     */
    //    convert className to class
    if (key === 'className') {
      element.setAttribute('class', value);
      //    process style, for example: style={{width: 200, height: 300}}, should convert 200 to '200px'
      //    and set element.style
      //    process tag 'for'
    } else if (key === 'htmlFor') {
      element.setAttribute('for', value);
      //    process tag 'tabindex'
    } else if (key === 'tabIndex') {
      element.setAttribute('tabindex', value);
    } else if (key === 'style') {
      switch (typeof value) {
        case 'string': {
          // element.setAttribute('style', attribute);
          // use element.style.cssText but not element.setAttribute
          // because browser render engine will check style key
          // if style key is invalid, browser render engine will not set the style attribute
          element.style.cssText = value;
          break;
        }
        case 'object': {
          Object.keys(value).forEach((styleName) => {
            const rawStyleValue = value[styleName];
            element.style[styleName] = typeof rawStyleValue === 'number' ? `${rawStyleValue}px` : rawStyleValue;
          });
          break;
        }
        default: {
          break;
        }
      }
      //    process event name, convert onClick to onclick
    } else if (/^on[A-Z][A-Za-z]+$/.test(key)) {
      const htmlEventName = key.toLowerCase();
      element[htmlEventName] = value;
      //    key for diff render
    } else if (key === 'key') {
      element['key'] = value;
      //    value for form input
    } else if (key === 'value') {
      element['value'] = value;
      //    ref, reference https://reactjs.org/docs/refs-and-the-dom.html
    } else if (key === 'ref') {
      switch (typeof value) {
        case "object":
          value.current = element;
          break
        case "function":
          value(element);
          break;
        case "string":
          console.warn('String Refs is deprecated, use ref by componentInstance.createRef() or callback function.' +
          `Occurred in element: ${element}, key: ${key}, value: ${value}`);
          break;
        default:
          console.warn(`UnSupport ref type. Occurred in element: ${element}, key: ${key}, value: ${value}`)
      }
      //    otherwise
    } else {
      element.setAttribute(key, value);
    }
  }

  public static _diffRender(oldTrueDom: ReactNode, newVirtualDom: VirtualNode): ReactNode {
    switch (typeof newVirtualDom) {
      case 'string':
      case 'number':
      case 'boolean': {
        return this._diffRenderText(oldTrueDom, newVirtualDom as VirtualTextNode);
      }
      case 'object':
      default: {
        const {tagName} = newVirtualDom;
        switch (typeof tagName) {
          case 'string': {
            return this._diffRenderHTML(oldTrueDom, newVirtualDom as VirtualHTMLDOM);
          }
          case 'function':
          case 'object':
          default: {
            return this._diffRenderComponent(oldTrueDom, newVirtualDom as VirtualComponentDOM)
          }
        }
      }
    }
  }

  private static _diffRenderText(oldTrueDom: ReactNode, newVirtualDom: VirtualTextNode): ReactNode {
    const newText = String(newVirtualDom);
    let newTrueDom = oldTrueDom;
    if (oldTrueDom?.nodeType === 3) {
      if (oldTrueDom.textContent !== newText) {
        oldTrueDom.textContent = newText
      }
    } else {
      // first render or node type is not Text
      newTrueDom = document.createTextNode(newText);
    }
    return newTrueDom;
  }

  private static _diffRenderHTML(oldTrueDom: ReactNode, newVirtualDom: VirtualHTMLDOM): ReactNode {
    const newHTMLTag = newVirtualDom.tagName;
    let newTrueDom;

    const isSameNodeType = this._isSameNodeType(oldTrueDom, newVirtualDom)

    /**
     * handle children in component
     * child is array when the it is children of component props,
     * like first child, second child, {props.children}, forth child and more
     */
    const newChildren = [];
    newVirtualDom.children.forEach(child => {
      if (Array.isArray(child)) {
        newChildren.push(...child)
      } else {
        newChildren.push(child)
      }
    })
    newVirtualDom.children = newChildren

    if (isSameNodeType) {
      newTrueDom = this._diffChildren(oldTrueDom, newVirtualDom);
    } else {
      newTrueDom = document.createElement(newHTMLTag);
      newVirtualDom.children.forEach(newChild => {
        if (Array.isArray(newChild)) {
          newChild.forEach(subChild => {
            const diffChild = this._diffRender(null, subChild);
            newTrueDom.appendChild(diffChild as Node)
          })
        } else {
          const diffChild = this._diffRender(null, newChild);
          newTrueDom.appendChild(diffChild as Node)
        }
      });
    }

    this._diffAttribute(newTrueDom as HTMLElement, newVirtualDom);

    return newTrueDom;
  }

  private static _diffRenderComponent(oldTrueDom: ReactElement | ReactNode, newVirtualDom: VirtualComponentDOM): ReactNode {
    const oldInstance = (oldTrueDom as ReactElement)?._instance;
    const newClass = newVirtualDom.tagName;

    const attributes = newVirtualDom.attributes ?? {}
    const children = newVirtualDom.children
    const props = {children, ...attributes}

    //@ts-ignore
    const isSameClassComponentType = oldInstance?.__proto__.constructor === newClass;
    //@ts-ignore
    const isSameFunctionComponentType = FunctionComponent.prototype.constructor === oldInstance?.__proto__.constructor
    const isSameComponentType = isSameClassComponentType || isSameFunctionComponentType

    let instance;
    if (isSameComponentType) {
      instance = oldInstance;
    } else {
      if (oldInstance) {
        unmount(oldInstance)
        const node = oldInstance._node;
        node.parentNode.removeChild(node);
      }
      instance = create(newClass as (FC<any> | ObjectConstructor), props);
    }
    setProps(instance, props);
    return instance._node;
  }

  private static _diffAttribute(oldTrueDom: ReactElement, newVirtualDom: VirtualHTMLDOM) {
    const oldAttributes = oldTrueDom?.attributes ?? {};
    const newAttributes = newVirtualDom.attributes ?? {};

    for (const oldAttributeIndex of Object.keys(oldAttributes)) {
      const oldAttribute = oldAttributes[oldAttributeIndex];
      const oldAttributeKey = oldAttribute.name;
      // const oldAttributeValue = oldAttribute.value;
      if (!(oldAttributeKey in newAttributes)) {
        this._setDomAttribute(oldTrueDom as HTMLElement, oldAttributeKey, undefined);
      }
    }

    const newAttributesKeys = Object.keys(newAttributes) ?? [];
    for (const newAttributeKey of newAttributesKeys) {
      const newAttributeValue = newAttributes[newAttributeKey];
      this._setDomAttribute(oldTrueDom as HTMLElement, newAttributeKey, newAttributeValue);
    }
  }

  private static _isSameNodeType(oldTrueDom: ReactElement | ReactNode, newVirtualDom: VirtualNode): boolean {
    if (oldTrueDom) {
      switch (typeof newVirtualDom) {
        case "string":
        case "number":
        case "boolean":
          return oldTrueDom.nodeType === 3;
        default:
          switch (typeof newVirtualDom.tagName) {
            case "string":
              return oldTrueDom.nodeName.toLowerCase() === newVirtualDom.tagName.toLowerCase();
            default:
              return (oldTrueDom as ReactElement)._instance?.constructor === newVirtualDom.tagName
          }
      }
    }
    return false;
  }

  private static _diffChildren(oldTrueDom: any, newVirtualDom: VirtualHTMLDOM): ReactNode {
    let oldChildKeyed = {}
    let oldChildren = []

    oldTrueDom.childNodes.forEach(child => {
      if (child.key) {
        oldChildKeyed[child.key] = child
      } else {
        oldChildren.push(child)
      }
    })

    newVirtualDom.children.forEach((newChild: any) => {
      const newChildKey = newChild.attributes?.key

      let oldChild;
      if (newChildKey && oldChildKeyed[newChildKey]) {
        oldChild = oldChildKeyed[newChildKey]
        delete oldChildKeyed[newChildKey]
      } else {
        // oldChildren may be empty, so oldChildren.shift() is null
        oldChild = oldChildren.shift()
      }

      const diffChild = this._diffRender(oldChild, newChild);
      if (diffChild !== oldChild) {
        if (oldChild) {
          oldChild.parentNode?.replaceChild(diffChild as Node, oldChild);
        } else {
          oldTrueDom.appendChild(diffChild as Node)
        }
      } else {
      }
    });

    oldChildren.forEach(child => {
      oldTrueDom.removeChild(child);
    })
    for (const childKey in oldChildKeyed) {
      oldTrueDom.removeChild(oldChildKeyed[childKey]);
    }

    return oldTrueDom;
  }



}
