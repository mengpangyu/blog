# 元素、组件、实例和节点

## 元素 Element

> 其实就是一个简单的 JS 对象，一个 React 元素和界面上的一部分 DOM 对应，描述了这部分 DOM 的结构及渲染效果，一般通过 JSX 创建 React 元素

```tsx
const element = <h1 className="greeting">Hello, world</h1>
```

element 是一个 React 元素，编译环境，JSX 会被编译成 createElement 的调用，JSX 返回的是 React 元素，编译结果为：

```jsx
const element = React.createElement('h1', { className: 'greeting' }, 'Hello, world!')
```

最终 element 的值类似以下 JS 对象

```js
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world',
  },
}
```

React 元素可以分为两类，DOM 元素和组件类型的元组，DOM 类型元素为原生 HTML 元素，React 的元素就是 React 组件

```tsx
const buttonElement = <Button color="red">OK</Button>
```

buttonElement 是组件类型元素，转换成 JS 值为

```js
const buttonElement = {
  type: 'Button',
  props: {
    color: 'red',
    children: 'OK',
  },
}
```

DOM 类型元素可直接渲染，组件类型元素需要特殊标识节点信息，React 会自动根据 React 元素渲染出最终页面的 DOM，React 元素描述的是 React 虚拟 DOM 的结构，React 会根据虚拟 DOM 渲染出页面的真实 DOM

## 组件 Component

React 组件和 React 元素关系密切，**React 组件最核心的作用是返回 React 元素**，最简单的组件就是返回 React 元素的函数

```tsx
// 函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
// 类组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}
```

React 组件的复用，本质上是为了复用这个组件返回的 React 元素，React 元素是 React 应用的最基础组成单位

## 实例 Instance

React 组件是一个函数或者类，实际工作时，发挥作用的是 React 组件的实例对象，只有实例化之后，每一个组件实例才有了自己的 props 和 state，才持有对它 DOM 节点和子组件实例的引用，React 中实例化工作是由React 自动完成的，组件的实例也是直接由 React 管理的

## 节点 Node

PropTypes.node 类型表示可以被 React 渲染的数据类型，包括数字，字符串，React 元素，或者是包含这些类型数据的数组

```tsx
// 数字类型的节点
function MyComponent(props) {
  return 1
}

// 字符串类型的节点
function MyComponent(props) {
  return 'MyComponent'
}

// React元素类型的节点
function MyComponent(props) {
  return <div>React Element</div>
}

// 数组类型的节点，数组的元素只能是其他合法的React节点
function MyComponent(props) {
  const element = <div>React Element</div>
  const arr = [1, 'MyComponent', element]
  return arr
}

// 错误，不是合法的React节点
function MyComponent(props) {
  const obj = { a: 1 }
  return obj
}
```

## 常见考点

1. React 元素（Element）
   React 元素是构建 React 应用的最小单位，它是 JavaScript 对象，代表了 UI 的一种描述，类似于虚拟 DOM。React 元素包含了组件的结构、样式和属性，但它不是 DOM 节点。

基本概念：React 元素是不可变的，一旦创建就不能修改它的子元素或属性。React 会使用这些元素描述来渲染 UI。
考察点：候选人是否知道 React 元素与 DOM 元素的区别，理解 React 元素是如何构成的。
示例问题：
什么是 React 元素？它和 DOM 元素有什么区别？
解释 React 元素的不可变性。如何使用 JSX 创建一个 React 元素？
创建方式：React 元素可以通过 React.createElement 或 JSX 来创建。
考察点：候选人应该理解 JSX 语法最终会转化为 React.createElement 调用，并且能够手动写出 createElement 的代码。
示例问题：
请写出一个 JSX 元素和一个 React.createElement 元素等效的代码。
虚拟 DOM：React 元素是虚拟 DOM 的一部分，React 会根据这些元素构建虚拟 DOM 树，从而对比实际 DOM 的变化并进行高效更新。
考察点：候选人是否理解虚拟 DOM 是如何通过 React 元素描述 UI，并与真实 DOM 进行对比更新的。
示例问题：
React 的虚拟 DOM 是如何工作的？React 元素如何与虚拟 DOM 关联？2. React 组件（Component）
React 组件是 React 应用的核心单位，它是一个 JavaScript 类或函数，控制着视图的渲染。组件可以接受 props（外部数据）和 state（内部状态）来控制它的输出。

基本概念：组件是 UI 的抽象，通常会返回一个 React 元素，并将其渲染到页面中。组件有两种类型：类组件和函数组件。

考察点：候选人是否理解组件的生命周期，props 和 state，以及它们如何影响组件的渲染。
示例问题：
什么是 React 组件？组件是如何接受和使用 props 和 state 的？
函数组件与类组件的主要区别是什么？如何实现相同的功能？
生命周期：类组件有生命周期方法（如 componentDidMount、shouldComponentUpdate 等），而函数组件可以通过 Hooks（如 useEffect）来处理副作用。

考察点：候选人是否知道组件的生命周期方法，以及如何使用 Hooks 处理副作用。
示例问题：
React 组件的生命周期方法有哪些？它们分别在什么时机执行？
如何在函数组件中模拟类组件的生命周期？
高阶组件（HOC）：高阶组件是一个函数，它接受一个组件并返回一个新的组件，通常用于增强或修改组件的行为。

考察点：候选人是否了解高阶组件的概念，以及如何使用它来增强组件的功能。
示例问题：
什么是高阶组件（HOC）？它是如何工作的？3. React 实例（Instance）
React 实例通常指的是一个组件的实例。对于类组件，实例是该组件类的一个对象，可以通过该对象访问组件的状态、方法等。

基本概念：组件实例代表了组件在 UI 中的一个实际存在，每次组件渲染时都会生成一个新的实例。

考察点：候选人是否理解组件实例是如何产生的，类组件和函数组件的实例化方式是否有区别。
示例问题：
在 React 中，如何获取一个类组件的实例？函数组件有实例吗？
实例方法：类组件的实例具有一些方法，比如 setState，forceUpdate 等，可以通过这些方法来更新组件的状态和强制刷新组件。

考察点：候选人是否理解如何使用组件实例中的方法来更新组件。
示例问题：
你如何在类组件中访问组件实例？this.setState() 和 this.forceUpdate() 的区别是什么？
组件实例的生命周期：实例在组件挂载、更新和卸载过程中会经历不同的生命周期阶段。

考察点：候选人是否了解组件实例在整个生命周期中的行为，尤其是组件的挂载和卸载过程。
示例问题：
当组件实例被销毁时，会发生什么？React 如何清理组件的资源？4. React 节点（Node）
React 节点是指 React 元素在页面上渲染后的实际 DOM 节点，React 会将虚拟 DOM 转换为真实 DOM。

基本概念：React 节点是虚拟 DOM 与实际 DOM 之间的桥梁，它是真实的 DOM 元素，代表了 React 元素渲染后的最终输出。

考察点：候选人是否知道 React 节点与 React 元素的区别，以及节点是如何与虚拟 DOM 进行交互的。
示例问题：
React 元素和 React 节点有什么区别？
你如何访问 React 节点（DOM 节点）？
渲染到 DOM：React 通过 ReactDOM.render 将虚拟 DOM 渲染成真实的 DOM 节点，并将其插入到页面中。

考察点：候选人是否理解 ReactDOM.render 的工作原理，以及它如何将虚拟 DOM 转换为实际的 DOM 元素。
示例问题：
ReactDOM.render 是如何工作的？它将虚拟 DOM 转换为实际 DOM 的过程是什么？
节点与组件的关系：组件通过返回 React 元素来定义它们的视图结构，而元素最终会被转换成 DOM 节点显示在页面上。

考察点：候选人是否理解组件与节点之间的关系，并知道如何管理节点的更新。
示例问题：
组件中的 React 元素如何转化为实际 DOM 节点？React 是如何管理节点的更新的？

## 面试题

[怎么判断 React 组件是函数组件还是类组件](/interview/lib/react.md#怎么判断-react-组件是函数组件还是类组件)

[怎么判断一个对象是否为 React 元素？](/interview/lib/react.md#怎么判断一个对象是否为-react-元素)
