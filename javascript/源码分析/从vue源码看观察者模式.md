## 观察者模式

首先话题下来，我们得反问一下自己，什么是观察者模式？

### 概念

观察者模式（Observer）：通常又被称作为发布-订阅者模式。它定义了一种一对多的依赖关系，即当一个对象的状态发生改变的时候，所有依赖于它的对象都会得到通知并自动更新，解决了主体对象与观察者之间功能的耦合。

### 讲个故事

上面对于观察者模式的概念可能会比较官方化，所以我们讲个故事来理解它。

- A：是共产党派往国民党密探，代号 001（发布者）
- B：是共产党的通信人员，负责与 A 进行秘密交接（订阅者）

1. A 日常工作就是在明面采集国民党的一些情报
2. B 则负责暗中观察着 A
3. 一旦 A 传递出一些有关国民党的消息（更多时候需要对消息进行封装传递，后面根据源码具体分析）
4. B 会立马订阅到该消息，然后做一些相对应的变更，比如说通知共产党们做一些事情应对国民党的一些动作。

### 适用性

以下任一场景都可以使用观察者模式

1. 当一个抽象模型有两个方面，其中一个方面依赖于另一方面。讲这两者封装在独立的对象中可以让它们可以各自独立的改变和复用
2. 当一个对象的改变的时候，需要同时改变其它对象，但是却不知道具体多少对象有待改变
3. 当一个对象必须通知其它对象，但是却不知道具体对象到底是谁。换句话说，你不希望这些对象是紧密耦合的。

## vue 对于观察者模式的使用

`vue` 使用到观察者模式的地方有很多，这里我们主要谈谈对于数据初始化这一块的。

```javascript
var vm = new Vue({
  data () {
    return {
      a: 'hello vue'
    }
  }
})
```



> ![](/Users/xuqiang/Downloads/vue1.png)

### 1、实现数据劫持

上图我们可以看到，`vue` 是利用的是 `Object.defineProperty()` 对数据进行劫持。 并在数据传递变更的时候封装了一层中转站，即我们看到的 `Dep` 和 `Watcher` 两个类。

这一小节，我们只看如何通过观察者模式对数据进行劫持。

#### 1.1、递归遍历

我们都知道，`vue` 对于 `data` 里面的数据都做了劫持的，那只能对对象进行遍历从而完成每个属性的劫持，源码具体如下

```javascript
walk (obj: Object) {
  const keys = Object.keys(obj)
  // 遍历将其变成 vue 的访问器属性
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
}
```

#### 1.2、发布/订阅

从上面对象的遍历我们看到了 `defineReactive` ，那么劫持最关键的点也在于这个函数，该函数里面封装了 `getter`  和 `setter` 函数，使用观察者模式，互相监听

```javascript
// 设置为访问器属性，并在其 getter 和 setter 函数中，使用发布/订阅模式，互相监听。
export function defineReactive (
  obj: Object,
  key: string,
  val: any
) {
  // 这里用到了观察者（发布/订阅）模式进行了劫持封装，它定义了一种一对多的关系，让多个观察者监听一个主题对象，这个主题对象的状态发生改变时会通知所有观察者对象，观察者对象就可以更新自己的状态。
  // 实例化一个主题对象，对象中有空的观察者列表
  const dep = new Dep()
  
  // 获取属性描述符对象(更多的为了 computed 里面的自定义 get 和 set 进行的设计)
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set
  
  let childOb = observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 收集依赖，建立一对多的的关系，让多个观察者监听当前主题对象
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          // 这里是对数组进行劫持
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    // 劫持到数据变更，并发布消息进行通知
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = observe(newVal)
      dep.notify()
    }
  })
}
```

#### 1.3、返回 Observer 实例

上面我们看到了`observe` 函数，核心就是返回一个 `Observer` 实例

```javascript
return new Observer(value)
```

### 2、消息封装，实现 "中转站"

**首先我们要理解，为什么要做一层消息传递的封装？**

我们在讲解观察者模式的时候有提到它的 `适用性` 。这里也同理，我们在劫持到数据变更的时候，并进行数据变更通知的时候，如果不做一个"中转站"的话，我们根本不知道到底谁订阅了消息，具体有多少对象订阅了消息。

这就好比上文中我提到的故事中的密探 A（发布者） 和共产党 B（订阅者）。密探 A 与 共产党 B 进行信息传递，两人都知道对方这么一个人的存在，但密探 A 不知道具体 B 是谁以及到底有多少共产党（订阅者）订阅着自己，可能很多共产党都订阅着密探 A 的信息，so 密探 A（发布者） 需要通过`暗号` 收集到所有订阅着其消息的共产党们（订阅者），这里对于订阅者的收集其实就是一层`封装`。然后密探 A 只需将消息发布出去，而订阅者们接受到通知，只管进行自己的 `update` 操作即可。

简单一点，即收集完订阅者们的密探 A 只管发布消息，共产党 B 以及更多的共产党只管订阅消息并进行对应的 `update` 操作，每个模块确保其独立性，实现`高内聚低耦合`这两大原则。

废话不多说，我们接下来直接开始讲 vue 是如何做的消息封装的

#### 2.1、Dep

`Dep`，全名 Dependency，从名字我们也能大概看出 `Dep` 类是用来做依赖收集的，具体怎么收集呢。我们直接看源码

```javascript
let uid = 0

export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    // 用来给每个订阅者 Watcher 做唯一标识符，防止重复收集
    this.id = uid++
    // 定义subs数组，用来做依赖收集(收集所有的订阅者 Watcher)
    this.subs = []
  }

  // 收集订阅者
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
```

代码很简短，但它做的事情却很重要

1. 定义subs数组，用来收集订阅者Watcher
2. 当劫持到数据变更的时候，通知订阅者Watcher进行update操作

源码中，还抛出了两个方法用来操作 `Dep.target` ，具体如下

```javascript
// 定义收集目标栈
const targetStack = []

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  // 改变目标指向
  Dep.target = _target
}

export function popTarget () {
  // 删除当前目标，重算指向
  Dep.target = targetStack.pop()
}
```

#### 2.2、 Watcher

`Watcher` 意为观察者，它负责做的事情就是订阅 `Dep` ，当`Dep` 发出消息传递（`notify`）的时候，所以订阅着 `Dep` 的 `Watchers` 会进行自己的 `update` 操作。废话不多说，直接看源码就知道了。

```javascript
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: Object
  ) {
    this.vm = vm
    vm._watchers.push(this)
    this.cb = cb
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // 解析表达式
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
      }
    }
    this.value = this.get()
  }

  get () {
    // 将目标收集到目标栈
    pushTarget(this)
    const vm = this.vm
    
    let value = this.getter.call(vm, vm)
    // 删除目标
    popTarget()
    
    return value
  }

  // 订阅 Dep，同时让 Dep 知道自己订阅着它
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        // 收集订阅者
        dep.addSub(this)
      }
    }
  }

  // 订阅者'消费'动作，当接收到变更时则会执行
  update () {
    this.run()
  }

  run () {
    const value = this.get()
    const oldValue = this.value
    this.value = value
    this.cb.call(this.vm, value, oldValue)
  }
}
```

上述代码中，我删除了一些与目前探讨无关的代码，如果需要进行详细研究的，可以自行查阅 vue2.5.3 版本的源码。

现在再去看 `Dep` 和 `Watcher`，我们需要知道两个点

1. `Dep` 负责收集所有的订阅者 `Watcher` ，具体谁不用管，具体有多少也不用管，只需要通过 `target` 指向的计算去收集订阅其消息的 `Watcher` 即可，然后只需要做好消息发布 `notify` 即可。
2. `Watcher` 负责订阅 `Dep` ，并在订阅的时候让 `Dep` 进行收集，接收到 `Dep` 发布的消息时，做好其 `update` 操作即可。

两者看似相互依赖，实则却保证了其独立性，保证了模块的单一性。

## 更多的应用

`vue` 还有一些地方用到了"万能"的`观察者模式`，比如我们熟知的组件之间的事件传递，`$on` 以及 `$emit` 的设计。

 `$emit` 负责发布消息，并对订阅者 `$on` 做统一消费，即执行 `cbs` 里面所有的事件。

```javascript
Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
  const vm: Component = this
  if (Array.isArray(event)) {
    for (let i = 0, l = event.length; i < l; i++) {
      this.$on(event[i], fn)
    }
  } else {
    (vm._events[event] || (vm._events[event] = [])).push(fn)
  }
  return vm
}

Vue.prototype.$emit = function (event: string): Component {
  const vm: Component = this
  let cbs = vm._events[event]
  if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs
    const args = toArray(arguments, 1)
    for (let i = 0, l = cbs.length; i < l; i++) {
      cbs[i].apply(vm, args)
    }
  }
  return vm
}
```

## 总结

本文探讨了观察者模式的基本概念、适用场景，以及在 vue 源码中的具体应用。这一节将总结一下观察者模式的一些优缺点

1. 目标和观察者间的抽象耦合：一个目标只知道他有一系列的观察者（目标进行依赖收集），却不知道其中任意一个观察者属于哪一个具体的类，这样目标与观察者之间的耦合是抽象的和最小的。
2. 支持广播通信：观察者里面的通信，不像其它通常的一些请求需要指定它的接受者。通知将会自动广播给所有已订阅该目标对象的相关对象，即上文中的 `dep.notify()` 。当然，目标对象并不关心到底有多少对象对自己感兴趣，它唯一的职责就是通知它的各位观察者，处理还是忽略一个通知取决于观察者本身。
3. 一些意外的更新：因为一个观察者它自己并不知道其它观察者的存在，它可能对改变目标的最终代价一无所知。如果观察者直接在目标上做操作的话，可能会引起一系列对观察者以及依赖于这些观察者的那些对象的更新，所以一般我们会把一些操作放在目标内部，防止出现上述的问题。

OK，本文到这就差不多了，更多的源码设计思路细节将在同系列的其它文章中进行一一解读。