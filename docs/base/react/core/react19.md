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
