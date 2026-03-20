import './App.css'
import Refresh from './components/suspense/refresh'
import Add from './components/suspense/add'
import TabDemo from './components/suspense/tab'

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">React Suspense Demo</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            基于{' '}
            <code className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono">
              use(promise)
            </code>{' '}
            的数据获取模式
          </p>
        </header>

        <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">场景一：刷新替换</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              每次点击替换现有数据，旧内容先进入 Suspense fallback
            </p>
          </div>
          <Refresh />
        </section>

        <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">场景二：追加列表</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              每次点击追加一条，各条目独立 Suspense 互不阻塞
            </p>
          </div>
          <Add />
        </section>

        <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">场景三：Tab 切换</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              使用 startTransition 切换 Tab，每个 Tab 内容独立 Suspense 加载
            </p>
          </div>
          <div className="p-6">
            <TabDemo />
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
