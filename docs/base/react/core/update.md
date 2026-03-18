# React 更新机制

## 更新机制

### 概述

前端渲染方案中，存在两种主流的更新机制

1. 直接更新制定节点，通常通过 Proxy 劫持数据，并将数据与 UI 进行一一绑定，数据变化时，对应的 UI 会直接更新，solid、svelte、angular 以此方案实现
2. 全量更新，通常通过 diff 算法来计算出需要更新的节点，然后更新这些节点，优点是可以保证 UI 更新是完整的，缺点是计算量比较大，性能较差

React 在内存中会根据组件的嵌套关系自顶向下生成一颗完整的 Fiber 树，组件执行时都会创建一个对应的 Fiber 节点，并将其挂载到 Fiber 树上

每当有 setState 调用时，React 内部机制会从最顶从 Root 根节点开始自上而下重新构建整颗 Fiber 树

**代码层面表现就是当任意的更新行为发生时，每一个定义的组件都会全部重新执行**

:::tip
注意两个关键信息：

1. 任意状态的更新行为，不管更新行为发生在哪个节点，都会导致整个组件重新执行
2. 重新更新的行为，从最顶层根节点开始自上而下重新构建

这是 React 更新理论的基石，也是 re-render 的本质
:::

React 在更新过程中会利用缓存机制来弱化不必要的 re-render 行为

### 缓存机制

Fiber 节点会判断 state 或 props 是否更新，如果更新那就在 render 中创建新的 Fiber 节点并缓存

```tsx
const fiber = {
  // 这里仅仅只是演示缓存,真实 Fiber 节点中,这里是一个链表结构,用于存储多个 Hook 对象
  memoizedState: 0,
  stateNode: null,
}
// 用于记录更新是否发生
const didReceiveUpdate = false

function render(state) {
  // 如果没有更新发生,则直接返回上一次渲染的 Fiber 节点
  if (!didReceiveUpdate) {
    return fiber
  }
  // 创建新的 Fiber 节点并缓存
  fiber.stateNode = createFiberNode()
}
```

尝试用 setState 更新时：

```tsx
function setState(newState) {
  // 如果新状态与旧状态不相等,则认为发生了更新
  if (newState !== fiber.memoizedState) {
    didReceiveUpdate = true
    // 更新状态
    fiber.memoizedState = newState
  }
}
```

通过这种缓存机制，只要代码运用得当，能避免所有的 re-render 行为，大量的节点都会在比较的过程中跳过执行，仅重新执行有变更的节点

以下四种方式可以做到完全利用缓存机制：

1. React Compiler，是 React 新发布的编译器，能够在代码构建时自动缓存所需要缓存的内容
2. 使用成熟的状态管理库，如 zustand、jotai、recoil 等，这些库都提供了非常优秀的缓存机制，能够实现更细粒度更新
3. 手动缓存，利用 diff 算法特性，巧妙的调整组件结构的分布，低成本实现缓存效果，掌握难度极高，需要对 React 的缓存对比机制有深入的了解
4. 利用 React 缓存 API，如 useMemo、useCallback、memo 等，强制缓存指定内容，容易滥用缓存 API，代码不优雅

### 比较规则

1. 节点类型是否发生变化，React 首先就会检查元素的标签名或者组件类型是否发生变化，如果发生变化，则认为节点需要更新，此时就算 key 相同，也会重新创建节点
2. key 是否发生变化，如果节点类型没有发生变化，则继续检查 key 是否变化，如果变化则需要更新
3. props 是否发生变化，React 不总是比较 props，当确认父组件没有发生变化时，则会跳过 props 的比较，如果发生了变化，则会比较每一个 props，比较 props 时如果不做特殊处理，则结果总是返回 false

:::tip
因此，顶尖高手总是尝试让父组件的结构保持稳定，让更新的组件始终为叶子节点，在不得不比较 props 时，需要利用 useMemo 或者 useCallback 配合 memo 来实现 props 的比较结果为 true
:::

1. state 是否发生变化，state 的比较也是浅比较

:::tip

因此在更新 state 时，要确保触发更新，就一定要确保新旧 state 不相等，如果新旧 state 相等，为引用类型时，需要手动创建新引用

:::

```tsx
setUserInfo({
  ...userInfo,
  name: 'new name',
})
```

1. context 是否发生变化，通过 Object.is 比较 Context Provider 的 value 值是否发生变化，React 会在 Fiber 节点上记录一个 dependencies 列表，标注该组件消费了哪些 Context，当 value 发生变化时，React 会遍历所有消费者进行 re-render

:::tip

因此 context 可能会导致大量冗余 re-render 发生，即使使用了 memo 跳过 props 比较，组件也会因为 context 的变化重新渲染，当发生这种情况时，通常用成熟的库替代 context，如 zustand

:::

## 缓存 API

### memo

针对子组件，即使没有传递任何 props，在父组件更新时，子组件也会重新渲染，可以使用 React.memo 来解决此问题

使用 memo 之前，React 内部会对新旧两次 props 进行比较简单的比较

```tsx
if (newProps === oldProps) {
  // 跳过更新 Bailout
}
```

父组件在重新 render 时，对应的子组件会重新执行，而执行时传入的 pros 总会是一个全新的引用对象

```tsx
;<Child />

// 等同于
React.createElement(Child, {})
```

由于引用不同，{} === {} 的结果永远是 false，此时子组件也会重新渲染

当时用 memo 包裹子组件时，比较规则会变成展开比较 props 中的每一项，此时子组件在父组件更新之后，依然缓存上一次的结果

**自定义比较函数**

memo 支持传入第二个参数，用于自定义比较函数，这种做法仅适用于少数情况，大多数时候不需要这么做

```tsx
function Message() {}

export default memo(Message, (prevProps, nextProps) => {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index]
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y
    })
  )
})
```

但如果使用了 React Compiler，则无需使用此函数手动优化缓存

### useCallback

是一个配合 memo 使用的 hook 函数，接收两个参数，第一个是想缓存的函数，第二个是依赖项数组，当依赖发生变化时，会返回一个新函数

```tsx{12-14}
import {useState, useCallback} from 'react'
import Child from './child'
import Number from './number'

export default function Demo() {
  const [count, setCount] = useState(0)

  function __clickHandler() {
    setCount(count + 1)
  }

  const __childClickHandler = useCallback(() => {
    console.log('child click')
  }, [])

  return (
    <div className='flex flex-col items-center p-4 gap-4'>
      <Child onClick={__childClickHandler} />
      <Number value={count} />
      <button className='button' onClick={__clickHandler}>点击递增</button>
    </div>
  )
}
```

:::warning

1. 比较常见的学习误区是认为 useCallback 可以节省函数的创建成本，实际上并没有节省，因为新函数始终会重新创建，只是可以帮我们获取稳定的引用而已
2. 第二个参数依赖项数组发生变化时，缓存引用会更新
3. 单独使用 useCallback 是没有意义的，需要配合 memo 一起使用才有意义

:::

### useMemo

用于缓存一个运算结果，当运算结果为函数时，useMemo 等同于 useCallback

```tsx
const __clickChildHandler = useMemo(
  () => () => {
    console.log('Child clicked')
  },
  [],
)
// 等价
const __clickChildHandler = useCallback(() => {
  console.log('Child clicked')
}, [])
```

### useLayoutEffect

| 生命周期阶段       | useEffect                                            | useLayoutEffect                                                 |
| :----------------- | :--------------------------------------------------- | :-------------------------------------------------------------- |
| 执行时机           | 浏览器绘制到屏幕后异步执行                           | DOM 更新后、浏览器绘制前同步执行                                |
| 流程示意           | 状态更新 → React 渲染 → DOM 更新 → 浏览器绘制 → 执行 | 状态更新 → React 渲染 → DOM 更新 → useLayoutEffect → 浏览器绘制 |
| 是否阻塞浏览器绘制 | 否                                                   | 是                                                              |
| 典型用途           | 副作用逻辑、安全修改数据，不阻塞渲染                 | 必须紧接 DOM 更新后修改 DOM，防止闪烁或测量布局                 |
| 注意事项           | 修改 DOM 可能用户看到闪烁；性能消耗较低              | 修改 DOM 不会被用户看到中间态；执行时间长会影响渲染性能         |

#### 实践案例

防止视觉闪烁

原理解析：

| 步骤 | useEffect 版本流程                             | useLayoutEffect 版本流程                        |
| ---- | ---------------------------------------------- | ----------------------------------------------- |
| 1    | State 从其他值变为 0                           | State 从其他值变为 0                            |
| 2    | React 渲染，DOM 更新为显示 "0"                 | React 渲染，DOM 更新为显示 "0"                  |
| 3    | 浏览器绘制屏幕，用户看到 "0"                   | useLayoutEffect 同步执行，将 state 更新为随机数 |
| 4    | useEffect 执行，将 state 更新为随机数          | React 立即再次渲染，DOM 更新为显示随机数        |
| 5    | React 再次渲染，浏览器再次绘制，用户看到随机数 | 浏览器绘制屏幕，用户直接看到随机数              |
| 6    | 用户会看到 "0 → 随机数" 的跳变过程！           | 用户只看到最终结果，不会看到中间状态！          |

测量 DOM 元素并动态调整

**为什么必须用 useLayoutEffect？**

如果使用 useEffect，会发生：

1. 组件渲染，背景色宽度为默认值
2. 浏览器绘制（用户看到错误的背景色宽度）
3. useEffect 测量文本宽度
4. 更新 state，重新渲染
5. 浏览器再次绘制（用户看到正确的背景色宽度）
6. 用户会看到背景色"跳动"的效果！

使用 useLayoutEffect 则可以在浏览器绘制前就完成测量和调整，用户只看到最终正确的效果。

动态 Tooltip 定位

根据触发元素的位置来动态定位,核心逻辑

```tsx
useLayoutEffect(() => {
  if (!tooltipRef.current || !targetRef.current) return

  // 1. 获取触发元素的位置
  const targetRect = targetRef.current.getBoundingClientRect()

  // 2. 计算 Tooltip 应该出现的位置
  const top = targetRect.top - tooltipRef.current.offsetHeight - 8
  const left = targetRect.left + targetRect.width / 2

  // 3. 设置 Tooltip 位置
  setPosition({ top, left })
}, [show])
```

如果使用 useEffect，Tooltip 会先出现在错误的位置，然后再跳到正确的位置，用户体验差

#### 何时使用 useLayoutEffect

1. 需要测量 DOM
   1. 获取元素尺寸、位置
   2. 根据测量结果调整样式
2. 防止视觉闪烁
   1. 在渲染后立即修改 DOM
   2. 避免用户看到中间状态
3. DOM 操作必须在绘制前完成
   1. 滚动位置同步
   2. 动画的初始状态设置
   3. 焦点管理
4. 第三方 DOM 库集成
   1. 需要在浏览器绘制前初始化或更新第三方库

### useSyncExternalStore

#### 为什么需要 useSyncExternalStore

在实际开发中，有大量的数据并不在 React 状态系统中，它们是外部数据源

例如：

- 浏览器 API：window.innerWidth，navigator.onLine
- 第三方状态库：Zustand、Redux、Mobx 内部维护的 store
- 全局变量：任何你在 React 组件树外部管理而数据

过去通常由 useEffect + useState 来订阅这些外部数据源

```tsx
const [width, setWidth] = useState(window.innerWidth)

useEffect(() => {
  const handler = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])
```

这种写法有两个问题：

- 初始值可能不同步，useState(window.innerWidth) 在服务端渲染时会报错, 因为服务端没有 window. 你不得不写成 useState(0), 然后在 useEffect 中再更新, 导致初始渲染时值是错的
- 并发渲染下可能出现 UI 撕裂 (Tearing). 在 React 18 的并发模式中, 一次渲染可能被中断. 如果渲染被中断期间外部数据发生了变化, 同一次渲染中, 不同组件可能读到不同的值, 导致 UI 不一致

useSyncExternalStore 正是为了解决这两个问题诞生

```tsx
import { useSyncExternalStore } from 'react'

const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
```

接受三个参数：

| 参数名            | 说明                                                     |
| ----------------- | -------------------------------------------------------- |
| subscribe         | 订阅函数。当外部数据变化时调用回调，返回取消订阅的函数。 |
| getSnapshot       | 获取当前数据快照的函数。                                 |
| getServerSnapshot | （可选）服务端渲染时获取快照的函数。                     |

#### 实践案例

案例 1：订阅浏览器窗口宽度

::: code-group

```tsx [useEffect.tsx]
import { useState, useEffect } from 'react'

export default function WindowWidthEffect() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2 border border-gray-200 dark:border-gray-700 p-4 flex-1">
      <div className="text-sm font-bold text-gray-500">useEffect 方案</div>
      <div className="text-3xl font-bold">{width}px</div>
      <div className="text-xs text-gray-400">当前窗口宽度</div>
    </div>
  )
}
```

```ts [useSyncExternalStore.tsx]
import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

function getSnapshot() {
  return window.innerWidth
}

export default function WindowWidthSync() {
  const width = useSyncExternalStore(subscribe, getSnapshot)

  return (
    <div className='flex flex-col items-center gap-2 border border-green-200 dark:border-green-700 p-4 flex-1'>
      <div className='text-sm font-bold text-green-600 dark:text-green-400'>useSyncExternalStore 方案</div>
      <div className='text-3xl font-bold'>{width}px</div>
      <div className='text-xs text-gray-400'>当前窗口宽度</div>
    </div>
  )
}
```

:::

两种方案核心差异：

- useEffect 方案需要手动管理三件事: 状态声明、事件监听、清理函数. 而且初始值必须写成 useState(0) 然后在 effect 中修正, 否则 SSR 会报错
- useSyncExternalStore 方案将 subscribe 和 getSnapshot 抽离为独立函数, 组件内只需一行调用. React 会自动处理订阅、取消订阅、以及数据同步

:::tip
注意观察右侧方案中, subscribe 和 getSnapshot 都定义在组件外部. 这是最佳实践——避免在每次渲染时创建新的函数引用, 否则会导致不必要的重新订阅
:::

案例 2：监听网络状态

```tsx
import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getSnapshot() {
  return navigator.onLine
}

export default function App() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot)

  return (
    <div className="p-4 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-lg font-bold">{isOnline ? '网络已连接' : '网络已断开'}</span>
      </div>
      <p className="text-xs text-gray-400">
        试试断开 Wi-Fi 或在 DevTools Network 面板中切换为 Offline
      </p>
    </div>
  )
}
```

一个 subscribe 函数可以监听多个事件，只要任意一个事件触发，React 就会调用 getSnapshot 获取最新值，并决定是否要重新渲染

#### 更新原理：与 useState 的本质区别

useState 的更新路径

```tsx
setState(newValue)
  → 标记当前 Fiber 节点有更新
  → 从 Root 开始调度更新
  → 自上而下构建 Fiber 树
  → diff 比较, 跳过无变化节点
  → commit 阶段更新 DOM
```

useSyncExternalStore 的更新路径

```tsx
外部数据变化
  → subscribe 的回调被触发
  → React 调用 getSnapshot() 获取最新值
  → 与上一次的快照进行 Object.is 比较
  → 如果不同, 标记当前 Fiber 节点有更新
  → 从 Root 开始调度更新
  → (后续流程与 useState 相同)
```

关键区别在于：**谁拥有数据**

useState 中，React 拥有数据，可以通过 setState 更新

useSyncExternalStore 中, 外部系统拥有数据, React 只是订阅并同步它. 这就是为什么它叫 "Sync External Store"——同步外部存储

这也是为什么 Zustand、Redux 等状态管理库的底层都使用了 useSyncExternalStore. 它们在 React 外部维护状态, 然后通过这个 Hook 让 React 组件能够安全地读取和响应外部状态的变化

案例 5：手写一个迷你状态管理库

:::code-group

```tsx [create-store.ts]
type Listener = () => void

export function createStore<T>(initialState: T) {
  let state = initialState
  const listeners = new Set<Listener>()

  return {
    getSnapshot: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    setState: (newState: T | ((prev: T) => T)) => {
      state = typeof newState === 'function' ? (newState as (prev: T) => T)(state) : newState
      listeners.forEach((l) => l())
    },
  }
}
```

```tsx [store.ts]
import { createStore } from './create-store'

export const counterStore = createStore({ count: 0, step: 1 })
```

```tsx [counter.tsx]
import { useSyncExternalStore } from 'react'
import { counterStore } from './store'

export default function Counter() {
  const { count, step } = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-4xl font-bold">{count}</div>
      <div className="flex items-center gap-2">
        <button
          className="button"
          onClick={() =>
            counterStore.setState((prev) => ({
              ...prev,
              count: prev.count - prev.step,
            }))
          }
        >
          - {step}
        </button>
        <button
          className="button"
          onClick={() =>
            counterStore.setState((prev) => ({
              ...prev,
              count: prev.count + prev.step,
            }))
          }
        >
          + {step}
        </button>
      </div>
    </div>
  )
}
```

```tsx [step-control.tsx]
import { useSyncExternalStore } from 'react'
import { counterStore } from './store'

export default function StepControl() {
  const { step } = useSyncExternalStore(counterStore.subscribe, counterStore.getSnapshot)

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">步长:</span>
      {[1, 5, 10].map((s) => (
        <button
          key={s}
          className={`px-3 py-1 text-sm rounded-sm ${
            step === s
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          }`}
          onClick={() => counterStore.setState((prev) => ({ ...prev, step: s }))}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
```

```tsx [index.tsx]
import Counter from './counter'
import StepControl from './step-control'

export default function App() {
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <Counter />
      <StepControl />
      <p className="text-xs text-gray-400">
        Counter 和 StepControl 是两个独立组件, 共享同一个外部 store
      </p>
    </div>
  )
}
```

:::

createStore 具备了状态管理库的核心能力：

- 创建外部存储状态：state 变量定义在 React 组件树之外
- 发布订阅模式：listeners 集合管理所有订阅者
- 触发更新：setState 修改数据后通知所有订阅者
- React 集成：通过 useSyncExternalStore 让组件自动响应变化

#### 总结

useSyncExternalStore 是 React 中唯一一个专为外部数据源设计的 Hook. 它不是 useEffect + useState 的语法糖, 而是解决了一个根本性问题: **如何在并发渲染下安全地读取外部数据**

使用场景：

- 订阅浏览器 API (窗口尺寸、网络状态、媒体查询等)
- 集成第三方状态管理库 (Zustand、Redux、MobX)
- 订阅任何 React 组件树外部的可变数据源
