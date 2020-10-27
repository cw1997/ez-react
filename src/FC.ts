import {VirtualDOM} from "./index";

// export type FC<P> = ((props: P) => VirtualDOM);

export interface FC<P> {
  (props: P): VirtualDOM
}
