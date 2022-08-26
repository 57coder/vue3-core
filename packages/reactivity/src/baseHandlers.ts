import { track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const baseHandlers = {
  get(target: object, key: PropertyKey, receiver: any) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    track(target, "get" as const, key);

    return Reflect.get(target, key, receiver);
  },
  set(target: object, key: PropertyKey, value: any, receiver: any) {
    let oldValue = (target as any)[key];
    const result = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, "set", key, value, oldValue);
    }
    return result;
  },
};
