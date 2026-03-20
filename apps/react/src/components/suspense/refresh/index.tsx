import { Suspense, useState } from 'react'
import { getMessage } from './api'
import Message from './message'

export default function Refresh() {
  const [promise, update] = useState<ReturnType<typeof getMessage>>()

  function handleRefresh() {
    update(getMessage())
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
        >
          <span>刷新数据</span>
        </button>
      </div>
      <Suspense fallback={<MessageSkeleton />}>
        <Message promise={promise} />
      </Suspense>
    </div>
  )
}

function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-zinc-700 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-24" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
      </div>
    </div>
  )
}
