## 阿里
### 项目相关
1. 自我介绍：职业经历，项目经历
2. 选一个你觉得印象最深的项目讲一讲，然后会从项目里面切入到 web 基础（html/css/js），这一块大概会聊 20-30 分钟，所以一定要提前选好一个自己做过的得意的项目，花一点时间捋一捋你觉得项目中出色的点，用到了比较 hack，比较酷炫的方法解决了哪些痛点。

### js 基础（es5）
1. 原型：这里可以谈很多，只要围绕 [[prototype]] 谈，都没啥问题
2. 闭包：牵扯作用域，可以两者联系起来一起谈
3. 作用域：词法作用域，动态作用域
4. this：不同情况的调用，this 指向分别如何。顺带可以提一下 es6 中箭头函数没有 this, arguments, super 等，这些只依赖包含箭头函数最接近的函数
5. call，apply，bind 三者用法和区别：参数、绑定规则（显示绑定和强绑定），运行效率（最终都会转换成一个一个的参数去运行）、运行情况（call，apply 立即执行，bind 是return 出一个 this “固定”的函数，这也是为什么 bind 是强绑定的一个原因）。

**注：“固定”这个词的含义，它指的固定是指只要传进去了 context，则 bind 中 return 出来的函数 this 便一直指向 context，除非 context 是个变量**
6. 变量声明提升：js 代码在运行前都会进行 AST 解析，函数申明默认会提到当前作用域最前面，变量申明也会进行提升。但赋值不会得到提升。关于 AST 解析，这里也可以说是形成词法作用域的主要原因


**这里如果面试官问到2，3，4，5，6中的一点，你能够把2，3，4，5，6整理到一起，串联起来进行统一的回答效果极佳**

具体参考[从指向看JavaScript](https://zhuanlan.zhihu.com/p/28058983)

### js 基础（es6）
1. let，const：let 产生块级作用域（通常配合 for 循环或者 {} 进行使用产生块级作用域），const 申明的变量是常量（内存地址不变）
2. Promise：这里你谈 promise 的时候，除了将他解决的痛点以及常用的 API 之外，最好进行拓展把 eventloop 带进来好好讲一下，microtask、macrotask 的执行顺序，如果看过 promise 源码，最好可以谈一谈 原生 Promise 是如何实现的。Promise 的关键点在于callback 的两个参数，一个是 resovle，一个是 reject。还有就是 Promise 的链式调用（Promise.then()，每一个 then 都是一个责任人）。

详细参考[my-promise](https://github.com/xuqiang521/overwrite/tree/master/src/my-promise)
3. Generator：遍历器对象生成函数，最大的特点是可以交出函数的执行权
- `function` 关键字与函数名之间有一个星号；
- 函数体内部使用 `yield` 表达式，定义不同的内部状态；
- `next` 指针移向下一个状态

这里你可以说说 `Generator` 的异步编程，以及它的语法糖 `async` 和 `awiat`，传统的异步编程。ES6 之前，异步编程大致如下

- 回调函数
- 事件监听
- 发布/订阅

传统异步编程方案之一：协程，多个线程互相协作，完成异步任务。thunk
4. async、await：Generator 函数的语法糖。有更好的语义、更好的适用性、返回值是 Promise。
- async => *
- await => yield

基本用法
```javascript
async function timeout (ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)    
  })
}
async function asyncConsole (value, ms) {
  await timeout(ms)
  console.log(value)
}
asyncConsole('hello async and await', 1000)
```
注：最好把2，3，4 连到一起讲

5. AMD，CMD，CommonJs，ES6 Module：解决原始无模块化的痛点
- AMD：requirejs 在推广过程中对模块定义的规范化产出，提前执行，推崇依赖前置
- CMD：seajs 在推广过程中对模块定义的规范化产出，延迟执行，推崇依赖就近
- CommonJs：模块输出的是一个值的 copy，运行时加载，加载的是一个对象（module.exports 属性），该对象只有在脚本运行完才会生成
- ES6 Module：模块输出的是一个值的引用，编译时输出接口，ES6 模块不是对象，它对外接口只是一种静态定义，在代码静态解析阶段就会生成。

### 框架

1. 数据双向绑定原理：常见数据绑定的方案
- Object.defineProperty（vue）：劫持数据的 getter 和 setter
- 脏值检测（angularjs）：通过特定事件进行轮循
- 发布/订阅模式：通过消息发布并将消息进行订阅

详细细节参考[实现一个属于我们自己的简易MVVM库](https://zhuanlan.zhihu.com/p/27028242)

扩充，[如何监听数组变化](https://zhuanlan.zhihu.com/p/27166404)

2. VDOM：三个 part，
- 虚拟节点类，将真实 DOM 节点用 js 对象的形式进行展示，并提供 render 方法，将虚拟节点渲染成真实 DOM
- 节点 diff 比较：对虚拟节点进行 js 层面的计算，并将不同的操作都记录到 patch 对象
- re-render：解析 patch 对象，进行 re-render

详细请参考 [实现Virtual Dom && Diff](https://zhuanlan.zhihu.com/p/27437595)

> 补充1：VDOM 的必要性？

- **创建真实DOM的代价高**：真实的 DOM 节点 node 实现的属性很多，而 vnode 仅仅实现一些必要的属性，相比起来，创建一个 vnode 的成本比较低。

- **触发多次浏览器重绘及回流**：使用 vnode ，相当于加了一个缓冲，让一次数据变动所带来的所有 node 变化，先在 vnode 中进行修改，然后 diff 之后对所有产生差异的节点集中一次对 DOM tree 进行修改，以减少浏览器的重绘及回流。

> 补充2：vue 为什么采用 vdom？

引入 Virtual DOM 在性能方面的考量仅仅是一方面。

性能受场景的影响是非常大的，不同的场景可能造成不同实现方案之间成倍的性能差距，所以依赖细粒度绑定及 Virtual DOM 哪个的性能更好还真不是一个容易下定论的问题。

Vue 之所以引入了 Virtual DOM，更重要的原因是为了解耦 HTML 依赖，这带来两个非常重要的好处是：

- 不再依赖 HTML 解析器进行模版解析，可以进行更多的 AOT 工作提高运行时效率：通过模版 AOT 编译，Vue 的运行时体积可以进一步压缩，运行时效率可以进一步提升；
- 可以渲染到 DOM 以外的平台，实现 SSR、同构渲染这些高级特性，Weex 等框架应用的就是这一特性。

综上，Virtual DOM 在性能上的收益并不是最主要的，更重要的是它使得 Vue 具备了现代框架应有的高级特性。

3. vue 和 react 区别
- 相同点：都支持 ssr，都有 vdom，组件化开发，实现 webComponents 规范，数据驱动等
- 不同点：vue 是双向数据流（当然为了实现单数据流方便管理组件状态，vuex 便出现了），react 是单向数据流。vue 的 vdom 是追踪每个组件的依赖关系，不会渲染整个组件树，react 每当应该状态被改变时，全部子组件都会 re-render。

上面提到的每个点，具体细节还得看自己的理解

4. 为什么用 vue ：简洁、轻快、舒服、没了
