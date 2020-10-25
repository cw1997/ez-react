import React from "./React";

export type VirtualDOM = {
    tagName: string
    attributes?: any
    children?: VirtualDOM[]
}

export default React;
