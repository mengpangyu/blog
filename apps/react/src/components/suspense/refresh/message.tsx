import { use } from 'react'
import { getMessage } from './api'

interface MessageProps {
  promise?: ReturnType<typeof getMessage>
}

const Message = ({ promise }: MessageProps) => {
  if (!promise) {
    return (
      <div className="flex items-center justify-center h-16 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-zinc-700 rounded-xl">
        暂无数据，点击刷新按钮加载
      </div>
    )
  }

  const message = use(promise)

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
        <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">#</span>
      </div>
      <div>
        <div className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">随机数值</div>
        <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
          {message.value.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export default Message
