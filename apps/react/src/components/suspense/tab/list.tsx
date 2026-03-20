import { use } from 'react'
import { getUsersInfo } from './api'

export default function CurrentList({ promise }: { promise: ReturnType<typeof getUsersInfo> }) {
  const users = use(promise)
  return (
    <div className="space-y-2">
      {users.map((item) => (
        <div
          key={item.id}
          className="flex border p-4 items-center border-gray-200 dark:border-gray-700"
        >
          <img className="size-12 rounded-full object-cover" src={item.picture.large} alt="" />
          <div className="flex-1 ml-4">
            <div className="font-bold text-gray-900 dark:text-gray-100">{item.name.last}</div>
            <div className="text-gray-400 dark:text-gray-500 text-sm mt-1 line-clamp-1">
              {item.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
