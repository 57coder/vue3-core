export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const baseHandlers = {
  get(target: object, key: PropertyKey, receiver: any) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    return Reflect.get(target, key, receiver);
  },
  set(target: object, key: PropertyKey, value: any, receiver: any) {
    return Reflect.set(target, key, value, receiver);
  },
};
