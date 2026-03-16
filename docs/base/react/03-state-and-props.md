# state 与 props

## state

是组件内部的状态，不能够直接修改，必须通过 setState 来改变值的状态，从而达到更新数组内部数据的作用

:::warning
setState 使用的注意事项：

1. 调用时会更新组件的 state，并且重新调用 render 方法，然后再把 render 方法渲染的内容展示到页面上
2. 并不会马上修改 state，而是把这个对象放到一个更新队列中，稍后才会从队列当中把新的状态提取出来合并到 state 当中，然后再触发组件更新，也就是说 setState 的更新是异步的
3. 如果想要及时更新 state
   1. 需使用 setState 的回调函数写法
   2. 在 react 监测不到的方法调用 setState，比如 setTimeout，调用原生事件时等

```js
// 回调函数
const [data, setData] = useState(1)
setData((prev) => prev + 1)

// setTimeout
setTimeout(() => {
  setData(data + 1)
})

// 原生事件
const onClick = () => {
  setData(data + 1)
}
document.querySelector('#btn-raw').addEventListener('click', onClick)
```

:::

## props

props 是指组件间传递值的一种方式，props 可以传递 state，由于 React 数据流是自上而下的，所以从父组件向子组件传递，组件内部的 props 是只读的不可修改

:::info
特性：

1. 只读性：经常用作渲染组件和初始化状态，一个组件被实例化之后，props 是只读的，不可改变的，如果在渲染图中被改变，会导致整个组件显示的形态不可预测，只有通过父组件重新渲染的方式才可以把新的 props 传入组件中
2. 不变性：只能通过外部组件主动传入新的 props 来更新渲染子组件，否则子组件的 props 以及展现形式不会改变

:::

## 总结

1. props 用于定义外部接口，state 用于记录内部状态
2. props 的赋值在于外部世界使用组件，state 的赋值在于组件内部
3. 组件不应该改变 props 的值，而 state 存在的目的就是让组件来修改的
4. state 只能在 constructor 中设置默认值
5. setState 修改 state 的值是异步的

## 常考点

### 1. 受控组件与非受控组件

概念：

- 受控组件：组件的 state 由 React 控制，用户输入的值会同步到 state
- 非受控组件：组件的 state 由 DOM 控制，React 不干预

考察点：

- 受控组件概念：组件的值通过 state 管理，输入框的值由 state 管理
- 非受控组件概念：使用 ref 来直接访问 DOM 元素的值
- 什么时候使用受控组件，什么时候使用非受控组件

### 2. state 的合并与批量更新

**概念：**

React 会在更新多个 setState 时进行批量更新

**考察点：**

- setState 的合并：多个调用 setState 后，React 会合并更新，而不是每次都重新渲染
- setState 批量更新的性能优化：理解如何利用批量更新提高性能

**示例问题：**

- setState 是如何合并更新的？如何在多个 setState 调用时避免不必要的渲染？

### 3. `state` 的优化

概念：

`state` 的更新和重新渲染会影响性能，特别是在大型应用中，候选人需要了解如何优化 `state` 的管理和更新

**考察点：**

- **React.memo** 与 shouldComponentUpdate: 如何防止不必要的重新渲染
- 局部更新 state：如何优化 state 的结构，避免更新整个对象导致不必要的渲染

示例问题：

- 如何优化 React 的 state 更新，避免不必要的重新渲染？
