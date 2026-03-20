import type { Tab } from './config'

export default function Tabs({
  tabs,
  onSwitch,
}: {
  tabs: Tab[]
  onSwitch: (index: number) => void
}) {
  return (
    <div>
      <div className="hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.active)!.name}
          onChange={(e) => onSwitch(e.target.selectedIndex)}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, i) => (
            <a
              key={tab.name}
              href={tab.href}
              className={classNames(
                tab.active
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                'px-3 py-2 text-sm font-medium',
              )}
              aria-current={tab.active ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault()
                onSwitch(i)
              }}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
