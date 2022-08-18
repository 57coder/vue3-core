import { isObject } from "@vue/shared";
import { baseHandlers, ReactiveFlags } from "./baseHandlers";

export const reactiveMap = new WeakMap<any, any>();

export function reactive(target: any) {
  if (!isObject(target)) return;

  if (target[ReactiveFlags.IS_REACTIVE]) return target;

  let exsitingProxy = reactiveMap.get(target);
  if (exsitingProxy) return exsitingProxy;

  let proxy = new Proxy(target, baseHandlers);

  reactiveMap.set(target, proxy);

  return proxy;
}
