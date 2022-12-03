export let activeEffect: ReactiveEffect | undefined;

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

class ReactiveEffect<T = any> {
  active = true;
  parent: ReactiveEffect | undefined = undefined;
  deps: any = [];
  constructor(public fn: () => T) {}
  // 执行effect
  run() {
    if (!this.active) return this.fn();
    try {
      this.parent = activeEffect;
      activeEffect = this;
      // 当稍后调用取值操作时，就可以获取到这个全局的 activeEffect 了
      cleanupEffect(this);
      const result = this.fn();
      return result;
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
  stop() {
    if (this.active) {
      this.active = false
      cleanupEffect(this)
    }
  }
}

const targetMap = new WeakMap();
export function track(target: object, type: string, key: PropertyKey) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    console.log("走你");
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}

export function trigger(
  target: object,
  type: string,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown
) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const run = (effects: ReactiveEffect<any>[]) => {
    effects &&
      effects.forEach((e: ReactiveEffect) => {
        if (e !== activeEffect) e.run();
      });
  };
  if (key === "length" && Array.isArray(target)) {
    depsMap.forEach((deps: any, key: string) => {
      key === "length" && run(deps);
    });
  } else run([...depsMap.get(key)]);
}

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    effect.deps.length = 0;
  }
}

export function effect<T = any>(fn: () => T) {
  // 创建 响应式 effect
  const _effect = new ReactiveEffect(fn);
  _effect.run();

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}
