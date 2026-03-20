import { use } from 'react'
import { getMessage } from './api'

interface MessageProps {
  promise: ReturnType<typeof getMessage>
  index: number
}

const Message = ({ promise, index }: MessageProps) => {
  const message = use(promise)

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
        <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          {index + 1}
        </span>
      </div>
      <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium tabular-nums">
        {message.value.toLocaleString()}
      </span>
      <span className="ml-auto text-xs text-emerald-400 dark:text-emerald-600">已加载</span>
    </div>
  )
}

export default Message
