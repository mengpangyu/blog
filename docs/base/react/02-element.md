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
