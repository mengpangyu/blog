---
order: 1
---

# React

## 什么是 JSX

JSX 即 JavaScript XML，一种在 React 组件内部构建标签的类 XML 语法，JSX 为 react.js 开发的一套语法糖，React 在不使用 JSX 的情况下一样可以工作，然而 JSX 可以提高组件可读性，因此推荐使用 JSX

```tsx
class MyComponent extends React.Component {
  render() {
    let props = this.props
    return (
      <div className="my-component">
        <a href={props.url}>{props.name}</a>
      </div>
    )
  }
}
```

**优点**：

- 允许使用熟悉的语法定义 HTML 元素树
- 提供更加语义化且移动的标签
- 程序结构更容易被直观化
- 抽象了 React Element 的创建过程
- 可以随时掌控 HTML 标签以及生成这些标签的代码
- 是原生的 JS

## React JSX 转换成真实 DOM 过程

### 是什么

JSX 通过 Babel 转成 React.createElement 形式，转换规则如下：

- 当首字母为小写时，其被认定为原生 DOM 标签，createElement 的第一个变量被编译为字符串
- 当首字母为大写时，其被认定为自定义组件，createElement 的第一个变量被编译为对象

最终都会通过 RenderDOM.render 方法进行挂载

### 过程

在 react 中，节点大致分为四个类别：

- 原生标签节点：type 是字符串，如 div、span
- 文本节点：type 就没有，这里是 TEXT
- 函数组件：type 是函数名
- 类组件：type 是类名

首次调用时，节点的 DOM 元素都会被替换，后续调用则会使用 Diff 算法进行高效更新

render 大致实现方法如下：

```js
function render(vnode, container) {
  console.log('vnode', vnode) // 虚拟DOM对象
  // vnode _> node
  const node = createNode(vnode, container)
  container.appendChild(node)
}

// 创建真实DOM节点
function createNode(vnode, parentNode) {
  let node = null
  const { type, props } = vnode
  if (type === TEXT) {
    node = document.createTextNode('')
  } else if (typeof type === 'string') {
    node = document.createElement(type)
  } else if (typeof type === 'function') {
    node = type.isReactComponent
      ? updateClassComponent(vnode, parentNode)
      : updateFunctionComponent(vnode, parentNode)
  } else {
    node = document.createDocumentFragment()
  }
  reconcileChildren(props.children, node)
  updateNode(node, props)
  return node
}

// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中
function reconcileChildren(children, node) {
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (Array.isArray(child)) {
      for (let j = 0; j < child.length; j++) {
        render(child[j], node)
      }
    } else {
      render(child, node)
    }
  }
}
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter((k) => k !== 'children')
    .forEach((k) => {
      if (k.slice(0, 2) === 'on') {
        let eventName = k.slice(2).toLocaleLowerCase()
        node.addEventListener(eventName, nextVal[k])
      } else {
        node[k] = nextVal[k]
      }
    })
}

// 返回真实dom节点
// 执行函数
function updateFunctionComponent(vnode, parentNode) {
  const { type, props } = vnode
  let vvnode = type(props)
  const node = createNode(vvnode, parentNode)
  return node
}

// 返回真实dom节点
// 先实例化，再执行render函数
function updateClassComponent(vnode, parentNode) {
  const { type, props } = vnode
  let cmp = new type(props)
  const vvnode = cmp.render()
  const node = createNode(vvnode, parentNode)
  return node
}
export default {
  render,
}
```

### 总结

虚拟 DOM 转换成真实 DOM 如图所示：

![](./images/react_2026-03-16-16-39-39.png)

- 使用 createElement 函数对 key 和 ref 等特殊 props 进行处理，并获取 defaultProps 的默认 props 进行赋值，并且对传入的孩子节点进行处理，最终构造成一个虚拟 DOM 对象
- ReactDOM.render 将生成好的虚拟 DOM 渲染到指定容器上，其中采用了批处理、事务机制并且针对特定浏览器进行了性能优化，最终转换为真实 DOM

## 怎么判断 React 组件是函数组件还是类组件？

可以使用 JS 的 typeof 运算符和 React 的 Component 来判断

```tsx
function isClassComponent(component) {
  return (
    // 判断类型为函数且有isReactComponent属性
    typeof component === 'function' && !!component.prototype.isReactComponent
  )
}

// 示例用法
const MyComponent = () => <div>Hello, I'm a function component!</div>
const MyClassComponent = class extends React.Component {
  render() {
    return <div>Hello, I'm a class component!</div>
  }
}

console.log(isClassComponent(MyComponent)) // false
console.log(isClassComponent(MyClassComponent)) // true
```

## 怎么判断一个对象是否为 React 元素？

使用 React.isValidElement 方法进行判断

```tsx
import React from 'react'

const MyComponent = () => {
  return <div>Hello, world!</div>
}

const elem = <MyComponent />

console.log(React.isValidElement(elem)) // true
console.log(React.isValidElement({})) // false
```

:::warning
该方法只能判断是否为 React 元素，不能判断元素类型和其他属性，如想获取元素的类型或其他属性，可以直接访问元素的属性，例如 type、props、key 等
:::

## React 组件通信

- 父传子：props

```tsx
function EmailInput(props) {
  return (
    <label>
      Email: <input value={props.email} />
    </label>
  )
}

const element = <EmailInput email="123124132@163.com" />
```

- 子传父：回调函数

```tsx
// 父
class Parents extends Component {
  constructor() {
    super()
    this.state = {
      price: 0,
    }
  }

  getItemPrice(e) {
    this.setState({
      price: e,
    })
  }

  render() {
    return (
      <div>
        <div>price: {this.state.price}</div>
        {/* 向子组件中传入一个函数  */}
        <Child getPrice={this.getItemPrice.bind(this)} />
      </div>
    )
  }
}
// 子
class Child extends Component {
  clickGoods(e) {
    // 在此函数中传入值
    this.props.getPrice(e)
  }

  render() {
    return (
      <div>
        <button onClick={this.clickGoods.bind(this, 100)}>goods1</button>
        <button onClick={this.clickGoods.bind(this, 1000)}>goods2</button>
      </div>
    )
  }
}
```

- 兄弟：父组件传递

```tsx
class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }
  setCount = () => {
    this.setState({ count: this.state.count + 1 })
  }
  render() {
    return (
      <div>
        <SiblingA count={this.state.count} />
        <SiblingB onClick={this.setCount} />
      </div>
    )
  }
}
```

- 爷孙：context

```tsx
// 生成
const PriceContext = React.createContext('price')
// 注入
<PriceContext.Provider value={100}>
</PriceContext.Provider>
// 消费
<PriceContext.Consumer>
    { /*这里是一个函数*/ }
    {
        price => <div>price：{price}</div>
    }
</PriceContext.Consumer>
```

- 非关系组件传递：redux

## setState 是同步还是异步？

### react 18 之前

- 在 promise 的状态更新、JS 原生事件、setTimeout、setInterval 中是同步的
- 在合成事件中是异步的

### react 18 之后

都为异步，[官方详细说明](https://github.com/reactwg/react-18/discussions/21)

TODO: 为什么 18 之后变为全部异步执行

:::warning
setState 的异步并不是内部由异步代码实现，其实本身执行过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓“异步”
:::

## 在 shouldComponentUpdate 或 componentWillUpdate 中使用 setState 会发生什么？

当调用 setState 的时候，实际上会将新的 state 合并到状态更新队列中，并对 partialState 以及 \_pendingStateQueue 更新队列进行合并操作。最终通过 enqueueUpdate 执行 state 更新。

如果在 shouldComponentUpdate 或 componentWillUpdate 中使用 setState，会使得 state 队列（\_pendingStateQueue）不为 null，从而调用 updateComponent 方法，updateComponent 中会继续调用 shouldComponentUpdate 和 componentWillUpdate，因此造成死循环。

## setState 之后发生了什么

### 简单版本

React 利用状态队列机制实现了 setState 的异步更，避免频繁的重复更新 state，首先将新 state 合并到状态更新队列中，然后根据更新队列和 shouldComponentUpdate 状态来判断是否需要更新组件

### 复杂版本

- enqueueSetState 将 state 放入队列中，并调用 enqueueUpdate 处理要更新的 Component
- 如果组件当前正在处于 update 事务中，则先将 Component 存入 dirtyComponent 中，否则调用 batchedUpdates 处理
- batchedUpdates 发起一次 transaction.perform 事务
- 开始执行事务初始化、运行、结束几个阶段
  - 初始化：事务初始化阶段没有注册方法，估无方法要执行
  - 运行：执行 setState 时传入的 callback 方法
  - 结束：更新 isBatchingUpdates 为 false，并执行 FLUSH_BATCHED_UPDATES 这个 wrapper 中的close方法，FLUSH_BATCHED_UPDATES在close阶段，会循环遍历所有的 dirtyComponents，调用updateComponent 刷新组件，并执行它的 pendingCallbacks, 也就是 setState 中设置的 callback

## Hooks 如何模拟生命周期

通过 useEffect 模拟

```tsx
// componentDidMount
useEffect(()=>{
  console.log('mounted')
}，[])

// componentDidUpdate
useEffect(()=>{
  console.log('update', source)
}，[source])

// componentWillUnmount
useEffect(()=>{
  return ()=>{
    console.log('unmount')
  }
}，[])
```

## 使用 Hooks 怎么实现类里面所有生命周期?

React 16.8 之后引入了 Hooks 概念，使得函数组件中也可以拥有自己的状态，并且可以模拟对应的生命周期

Hooks 的优势：

- 组件内的状态设置和更新相对独立，便于状态测试和复用
- 关联部分可拆分成更小的函数，并非强制按照生命周期划分，逻辑与生命周期解耦

Class 生命周期在 Hooks 中的实现：

| Class 组件生命周期方法     | Hooks 组件实现方式                                   |
| :------------------------- | :--------------------------------------------------- |
| `constructor`              | `useState`                                           |
| `getDerivedStateFromProps` | `useEffect` 手动对比 props，配合 `useState` 更新函数 |
| `shouldComponentUpdate`    | `React.memo`                                         |
| `render`                   | 函数组件本身                                         |
| `componentDidMount`        | `useEffect(() => {}, [])`                            |
| `componentDidUpdate`       | `useEffect` 配合 `useRef` 判断是否更新               |
| `componentWillUnmount`     | `useEffect` 返回的清理函数                           |
| `componentDidCatch`        | 暂无（函数组件无对应能力）                           |
| `getDerivedStateFromError` | 暂无（函数组件无对应能力）                           |

:::details 代码实现

```tsx
import React, { useState, useEffect, useRef, memo } from 'react'

// 使用 React.memo 实现类似 shouldComponentUpdate 的优化， React.memo 只对 props 进行浅比较
const UseEffectExample = memo((props) => {
  console.log('===== UseStateExample render=======')
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)
  const [fatherCount, setFatherCount] = useState(props.fatherCount)

  console.log(props)

  // 模拟 getDerivedStateFromProps
  useEffect(() => {
    // props.fatherCount 有更新，才执行对应的修改，没有更新执行另外的逻辑
    if (props.fatherCount == fatherCount) {
      console.log('======= 模拟 getDerivedStateFromProps=======')
      console.log(props.fatherCount, fatherCount)
    } else {
      setFatherCount(props.fatherCount)
      console.log(props.fatherCount, fatherCount)
    }
  })

  // 模拟DidMount
  useEffect(() => {
    console.log('=======只渲染一次(相当于DidMount)=======')
    console.log(count)
  }, [])

  // 模拟DidUpdate
  const mounted = useRef()
  useEffect(() => {
    console.log(mounted)
    if (!mounted.current) {
      mounted.current = true
    } else {
      console.log('======count 改变时才执行(相当于DidUpdate)=========')
      console.log(count)
    }
  }, [count])

  // 模拟 Didmount和DidUpdate 、 unmount
  useEffect(() => {
    // 在 componentDidMount，以及 count 更改时 componentDidUpdate 执行的内容
    console.log('======初始化、或者 count 改变时才执行(相当于Didmount和DidUpdate)=========')
    console.log(count)
    return () => {
      console.log('====unmount=======')
      console.log(count)
    }
  }, [count])

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>

      <button onClick={() => setCount2(count2 + 1)}>Click me2</button>
    </div>
  )
})

export default UseEffectExample
```

:::

:::warning

- useState 只在初始化时执行一次，后面不再执行
- `componentDidCatch` 和 `getDerivedStateFromError` 目前仅类组件支持，函数组件需用 Error Boundary 包裹
- React 保证了每次运行 effect 的同时，DOM 都已经更新完毕，也就是说 effect 中的获取的 state 是最新的，但是需要注意的是，effect 中返回的函数（其清除函数）中，获取到的 state 是更新前的
- 传递给 useEffect 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的 count 的值，而不用担心其过期的原因。每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染。
- effect 的清除阶段（返回函数）在每次重新渲染时都会执行，而不是只在卸载组件的时候执行一次。它会在调用一个新的 effect 之前对前一个 effect 进行清理，从而避免了我们手动去处理一些逻辑

:::

## React 为什么废弃了 componentWillMount、componentWillReceiveProps、componentWillUpdate 这三个生命周期？具体问题和优化方案是什么？

React 16.3 之后，官方对生命周期做了如下调整：

- 给 `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate` 加上 `UNSAFE_` 前缀，变成 `UNSAFE_componentWillMount`、`UNSAFE_componentWillReceiveProps` 和 `UNSAFE_componentWillUpdate`，以提示开发者慎用这些方法。
- 新增了静态生命周期钩子 `getDerivedStateFromProps` 作为新的数据派生入口。

到了 React 17 及以后版本：

- 正式移除了 `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate`，但带有 `UNSAFE_` 前缀的方法仍可用（不推荐）。

### 为什么要废弃？

React 生命周期分为 render 阶段和 commit 阶段。被废弃的这些生命周期都在 render 阶段执行。早期（同步渲染）阶段，render 阶段不会被中断。但 Fiber 架构引入后，render 阶段变成“可中断、可恢复”，某一生命周期可能被多次调用。

**问题：**

- render 阶段中的生命周期方法可能被多次触发，如果里面包含副作用（如异步请求、DOM 操作等），会产生重复执行，带来数据不一致或性能隐患。

### React 如何解决？

1. 新增 `getDerivedStateFromProps` 静态方法，专用于“纯函数式”地计算 state，不依赖实例，无副作用，执行更安全。
2. 强制副作用（如数据请求、订阅等）放在 commit 阶段（如 `componentDidMount`/`componentDidUpdate` 或对应的 `useEffect`）进行，避免渲染阶段副作用重复执行。
3. 通过 `UNSAFE_` 前缀警示开发者，逐步淘汰风险生命周期。

**总结：**  
React 废弃这三个生命周期，是为了适应 Fiber 架构下异步可中断的渲染流程，避免副作用或不纯逻辑造成的不确定性，鼓励开发者将副作用逻辑放在更安全的阶段，并引入新的静态生命周期方法进行状态计算，从源头上减少生命周期滥用问题。

## React 父子组件的生命周期执行顺序是怎么样的？

React 的生命周期从广义上分为三个阶段：挂载、渲染、卸载，因此可以分为两类：挂载卸载过程和更新过程

### 挂载卸载过程

1. constructor，完成了React数据的初始化；
2. componentWillMount，组件初始化数据后，但是还未渲染DOM前；
3. componentDidMount，组件第一次渲染完成，此时dom节点已经生成；
4. componentWillUnmount，组件的卸载和数据的销毁。

### 更新过程

1. componentWillReceiveProps (nextProps)，父组件改变后的props需要重新渲染组件时；
2. shouldComponentUpdate(nextProps,nextState)，主要用于性能优化(部分更新)，因为react父组件的重新渲染会导致其所有子组件的重新渲染，这个时候其实我们是不需要所有子组件都跟着重新渲染的，在这里return false可以阻止组件的更新；
3. componentWillUpdate (nextProps,nextState)，shouldComponentUpdate返回true后，组件进入重新渲染的流程；
4. componentDidUpdate(prevProps,prevState)，组件更新完毕后触发；
5. render()，渲染时触发。

### 父子组件生命周期的执行顺序

**挂载（Mount）阶段**

1. 先执行父组件的 constructor、getDerivedStateFromProps、render 方法；
2. 然后进入子组件，依次执行子组件的 constructor、getDerivedStateFromProps、render；
3. 接下来先触发子组件的 componentDidMount；
4. 最后触发父组件的 componentDidMount。

**卸载（Unmount）阶段**

1. 先触发子组件的 componentWillUnmount，完成清理；
2. 再触发父组件的 componentWillUnmount。

> 总结：**父组件先“构建”（初始化与渲染），子组件先“挂载完成”；卸载时，子组件先于父组件被卸载。** 这样可以确保父组件始终掌控子组件的存在过程和生命周期资源管理。
