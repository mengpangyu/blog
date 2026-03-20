import { Suspense, useState } from 'react'
import { getMessage } from './api'
import Message from './message'

export default function Add() {
  const [promises, update] = useState<ReturnType<typeof getMessage>[]>([])

  function handleAdd() {
    update((prev) => [...prev, getMessage()])
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          已加载{' '}
          <span className="font-semibold text-gray-700 dark:text-gray-300">{promises.length}</span>{' '}
          条
        </span>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
        >
          <span>追加一条</span>
        </button>
      </div>

      {promises.length === 0 ? (
        <div className="flex items-center justify-center h-16 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-zinc-700 rounded-xl">
          暂无数据，点击追加按钮加载
        </div>
      ) : (
        <div className="space-y-3">
          {promises.map((item, index) => (
            <Suspense key={index} fallback={<ItemSkeleton index={index} />}>
              <Message promise={item} index={index} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  )
}

function ItemSkeleton({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-zinc-700 animate-pulse">
      <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-zinc-700 flex-shrink-0" />
      <div className="flex-1 h-3 bg-gray-200 dark:bg-zinc-700 rounded w-24" />
      <div className="text-xs text-gray-300 dark:text-zinc-600">#{index + 1} 加载中…</div>
    </div>
  )
}
