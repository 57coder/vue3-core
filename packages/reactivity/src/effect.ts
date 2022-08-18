export let activeEffect: ReactiveEffect | undefined;

class ReactiveEffect<T = any> {
  active = true;
  constructor(public fn: () => T) {}
  // 执行effect
  run() {
    if (!this.active) return this.fn();
    try {
      activeEffect = this;
      // 当稍后调用取值操作时，就可以获取到这个全局的activeEffect了
      const result = this.fn();
      return result;
    } finally {
      activeEffect = undefined;
    }
  }
}

export function effect<T = any>(fn: () => T) {
  // 创建 响应式 effect
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
