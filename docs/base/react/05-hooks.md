# Hooks

## 技术背景

### Hooks 解决了什么问题

Hooks 出现的本质原因是：

- 让函数组件也能做类组件的事，有自己的状态，可以处理一些副作用，能获取 ref，也能做数据缓存
- 解决逻辑复用难的问题
- 放弃面对对象编程，拥抱函数式编程

### 为什么要使用自定义Hooks？

自定义 Hooks 是 React Hooks 基础上的一个拓展，可以根据业务需求制定满足业务需要组合的 Hooks，更注重的是逻辑单元，通过业务场景不同，封装不同的 Hooks 做到逻辑和 UI 复用，这也就是自定义 Hooks 产生的初衷。

自定义 Hooks 也可以说是 React Hooks 的聚合产物，内部有一个或者多个 Hooks 组成，用于解决复杂逻辑

## 闭包对 useEffect 的影响

在 2 个不同函数的作用域中，共同访问了同一个变量时，就会形成闭包

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(count)
  }, [count])
}
```

在 useEffect 中使用了 useState 定义的变量就形成了闭包

### 闭包环境是否稳定

effect 函数的引用是否被保留决定了闭包是否稳定

> 当组件函数执行时，useEffect 必定也会跟着执行，此时重新创建新的 effect 函数，如果 deps 依赖项发生了变化，那么新的 effect 函数会覆盖掉旧的 effect 函数

当旧的 effect 函数被新的 effect 函数覆盖时，上一次的闭包环境就彻底失去了引用，此时生效的是新的闭包环境

因此如果函数的执行次数与 deps 依赖变化次数严格一致，代码逻辑就不会受到闭包问题的影响

如果 deps 依赖变化次数，少于函数的执行次数，那么 effect 函数的逻辑，就有可能一直处于上一次的闭包环境中，而拿不到最新的状态值，这就是**闭包陷阱**

如下案例：希望 count 累加，count 只能拿到最初的值，因为 count 没有依赖

```tsx
const [count, setCount] = useState(0)

useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1)
  }, 1000)

  return () => clearInterval(timer)
  // 依赖没有改变,因此闭包环境稳定,effect 内部只能拿到初始渲染时的 count (0)
}, [])
```

修复此问题不能从当前的闭包环境中去拿上一次的值来计算，可以使用回调函数语法，从 Fiber 节点中直接获取最新值

```tsx
const [count, setCount] = useState(0)

useEffect(() => {
  const timer = setInterval(() => {
    // 使用函数式更新,从 Fiber 节点中获取最新值
    setCount((prevCount) => prevCount + 1)
  }, 1000)

  return () => clearInterval(timer)
}, [])
```

## useEffectEvent

React 19.2 引入的新 API，专门用于解决 `useEffect` 中的闭包陷阱问题。

在传统的 `useEffect` 中，回调引用到的 props 或 state 实际是 **effect 执行当时那一版的闭包环境**，容易出现取值过旧的 bug。`useEffectEvent` 的本质是：声明一个事件函数，每次运行时总会拿到**最新的 props、state 以及组件作用域内的所有变量**，但它本身的"身份"不会因为依赖变化而变，从而无需为副作用添加额外的依赖项。

### 基本用法

```tsx
import { useState, useEffect, useEffectEvent } from 'react'

function Example() {
  const [count, setCount] = useState(0)

  // 用 useEffectEvent 声明一个事件回调，里面始终获得最新的 count
  const handle = useEffectEvent(() => {
    console.log(count)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => c + 1)
      handle() // 每次都会拿到最新的 count
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <div>{count}</div>
}
```

### 适用场景

- 定时器、订阅、Promise 等异步回调中需要读取最新 state/props 的场景
- 想要避免因为依赖项频繁变化导致 effect 重复执行，但又希望回调中始终获取到最新数据

### 注意

- 它只适用于配合 `useEffect`，不能单独启动副作用，仅用来安全地声明回调闭包
- 可以理解为：`useEffectEvent` 让 effect 的「副作用注册」和「副作用逻辑」彻底分离，副作用回调永远指向最新的组件作用域。

## useImperativeHandle

用于自定义通过 `ref` 暴露给父组件的实例值。配合 `forwardRef` 使用，可以让父组件调用子组件内部的方法，而不暴露整个 DOM 节点。

### 基本用法

```tsx
import { useRef, useImperativeHandle, forwardRef } from 'react'

interface InputHandle {
  focus: () => void
  clear: () => void
}

const CustomInput = forwardRef<InputHandle>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => {
      if (inputRef.current) inputRef.current.value = ''
    },
  }))

  return <input ref={inputRef} {...props} />
})

// 父组件
function Parent() {
  const inputRef = useRef<InputHandle>(null)

  return (
    <div>
      <CustomInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>聚焦</button>
      <button onClick={() => inputRef.current?.clear()}>清空</button>
    </div>
  )
}
```

### 注意

- 第三个参数为依赖项数组，控制何时重新创建暴露的方法，省略时每次渲染都会重新创建
- 应尽量少用，大多数场景通过 props 和状态提升就能解决父子通信问题
- React 19 中 `ref` 可作为 props 直接传递，不再强制需要 `forwardRef`
