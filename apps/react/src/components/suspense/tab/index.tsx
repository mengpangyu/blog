import { Suspense, useState } from 'react'
import { tabs as initialTabs } from './config'
import Tabs from './tabs'
import CurrentList from './list'
import { getUsersInfo } from './api'

export default function TabDemo() {
  const [selectIndex, setSelectIndex] = useState(0)
  const [promise, update] = useState(getUsersInfo)

  function handleSwitch(index: number) {
    initialTabs[selectIndex]!.active = false
    initialTabs[index]!.active = true
    setSelectIndex(index)

    promise.cancel()
    update(getUsersInfo())
  }

  return (
    <div>
      <Tabs tabs={initialTabs} onSwitch={handleSwitch} />

      <div className="mt-6">
        <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          当前选中：
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {initialTabs[selectIndex]!.name}
          </span>
        </div>

        <Suspense fallback={<ListSkeleton />}>
          <CurrentList promise={promise} />
        </Suspense>
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex border p-4 items-center border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="size-12 rounded-full bg-gray-200 dark:bg-zinc-700 shrink-0" />
          <div className="flex-1 ml-4 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/4" />
            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
