# React 19

## use

use 是 React 19 提升异步开发体验最重要的 hook，也是让 useEffect 重要性大幅削弱的主要原因

可以利用 use 读取 Promise 的值

```tsx
const value = use(promise)
// 读取到的 value 是 promise 中 resolve的值
```

### 正确理解 promise

use 中的 promise 指的是一个已经创建好的 promise 对象，在该 promise 对象中已经有了确定的 resolve 的结果，use 读取的是 resolve 的值

```tsx
const _api2 = new Promise((resolve) => {
  resolve({ value: '_api2' })
})

// good
const result = use(_api2)

const _api3 = () => {
  return new Promise((resolve) => {
    resolve({ value: '_api3' })
  })
}

// bad: get an error
const result = use(_api3())
```

函数运行创建 Promise 对象，虽然执行之后能获取带有 resolve 结果状态的 Promise，但 use 不能第一时间拿到其值，所以报错

:::danger
async/await is not yet supported in Client Components, only Server Components. This error is often caused by accidentally adding 'use client' to a module that was originally written for the server.
:::

使用 use 的完整示例

:::code-group

```tsx [index.tsx]
import { use } from 'react'
import { random } from 'utils/index'
import Message from './message'

const __api = new Promise<{ value: string }>((resolve) => {
  resolve({ value: random[0] })
})

export default function Demo01() {
  const result = use(__api)
  return <Message message={result.value} />
}
```

```tsx [message.tsx]
import { Tent } from 'lucide-react'

const Message = (props: { message: string }) => {
  const message = props.message
  return (
    <div className="flex border border-gray-200 dark:border-0 dark:inset-ring dark:inset-ring-white/10 p-4 items-start m-4">
      <Tent />
      <div className="flex-1 ml-3">
        <div>React introduction</div>
        <div className="text-sm leading-6 mt-2 text-gray-600 dark:text-gray-400">{message}</div>
      </div>
    </div>
  )
}

export default Message
```

:::

### 在条件判断中使用

use 可以在循环和条件中使用

```tsx
import { use, useState } from 'react'
import { random } from 'utils/index'
import Skeleton from 'components/zmui/skeleton'
import Message from './message'

const __api = new Promise<{ value: string }>((resolve) => {
  resolve({ value: random[0] })
})

export default function Demo02() {
  const [loading, setLoading] = useState(false)
  let result = { value: '' }
  if (!loading) {
    result = use(__api)
  }

  return (
    <div className="p-4">
      {loading ? <Skeleton /> : <Message message={result.value} />}
      <div className="mt-4 text-right">
        <button className="button" onClick={() => setLoading(!loading)}>
          切换
        </button>
      </div>
    </div>
  )
}
```

### 在异步请求中使用

在异步请求时，也会结合 promise 来使用，但异步请求中的 promise 可能状态为 pending，所以必须结合 Suspense 来使用

## Suspense

Suspense 可以捕获 use 无法读取到数据时抛出的异常，然后此时会在页面上渲染回退组件 fallback

### 例子

:::code-group

```tsx [index.tsx]
import { Suspense } from 'react'
import Message from './message'
import Skeleton from 'components/zmui/skeleton'
import { getMessage } from './api'

export default function Page() {
  const promise = getMessage()
  return (
    <div className="p-4">
      <Suspense fallback={<Skeleton type="header" />}>
        <Message promise={promise} />
      </Suspense>
    </div>
  )
}
```

```tsx [message.tsx]
import { Tent } from 'lucide-react'
import { use } from 'react'
import { getMessage } from './api'

const Message = (props: { promise: ReturnType<typeof getMessage> }) => {
  const message = use(props.promise)
  return (
    <div className="flex border border-gray-200 dark:border-0 dark:inset-ring dark:inset-ring-white/10 p-4 items-start">
      <Tent />
      <div className="flex-1 ml-3">
        <div>React introduction</div>
        <div className="text-sm leading-6 mt-2 text-gray-600 dark:text-gray-400">
          {message.value}
        </div>
      </div>
    </div>
  )
}

export default Message
```

```ts [api.ts]
import { createRandomMessage } from '@/utils'

export function getMessage() {
  return new Promise<{ value: string }>((resolve) => {
    resolve({ value: createRandomMessage() })
  })
}
```

:::

### 工作原理

Suspense 提供了一个加载数据的标准，在源码中，Suspense 的子组件被称为 primary

当 react 在 beginWork 的过程中，遇到 Suspense 时，首先会尝试加载 primary 组件，如果 primary 组件只是一个普通组件，那么就顺利渲染完成

如果 primary 包含 use 读取异步数据的 promise 的组件，会在首次渲染时，抛出一个异常，react 捕获之后，发现是一个语法约定好的 promise，那么就会将其 then 的回调函数保存下来，并将下一个 nest beginWork 的组件重新指为 Suspense

此时 promise 在请求阶段，因此再次 beginWork Suspense 组件时，会跳过 primary 的执行而直接渲染 fallback

当 primary 中 promise 执行完成时 resolve，会执行刚才保存的 then 方法，此时会触发 Suspense 再次执行，由于此时 primary 中的 promise 已经 resolve，因此此时就可以拿到数据直接渲染 primary 组件

流程可简单表示为：

```js
Suspense ->
primary ->
Suspense ->
fallback ->
waiting -> resolve() ->
Suspense ->
primary ->
```

### primary 为普通组件时

当 primary 为普通组件时，会直接渲染普通组件

:::code-group

```tsx [index.tsx]
import { Suspense } from 'react'
import Skeleton from 'components/zmui/skeleton'
import { createRandomMessage } from '@/utils'
import Message from './message'

export default function Demo03() {
  return (
    <div className="p-4">
      <Suspense fallback={<Skeleton type="header" />}>
        <Message message={createRandomMessage()} />
      </Suspense>
    </div>
  )
}
```

```tsx [index.tsx]
import { Tent } from 'lucide-react'

const Message = (props: { message: string }) => {
  const message = props.message
  return (
    <div className="flex border border-gray-200 dark:border-0 dark:inset-ring dark:inset-ring-white/10 p-4 items-start">
      <Tent />
      <div className="flex-1 ml-3">
        <div>React introduction</div>
        <div className="text-sm leading-6 mt-2 text-gray-600 dark:text-gray-400">{message}</div>
      </div>
    </div>
  )
}

export default Message
```

:::

### 总结

与老版本 state + useEffect 完成首页初始化的需求相比，新的开发方法更加简洁，代码舒适度更高

不过在之前的开发方式中，可以自定义 hooks 的方式，把状态 useEffect 封装成自定义 hook

:::tip
JS 中，有一个特殊的内置对象 [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController) 可以终止异步任务，可以利用该对象实例来终止 fetch 请求
:::
