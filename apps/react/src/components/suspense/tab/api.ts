import Mock from 'mockjs'
import { delay } from '../../../utils'

interface PromiseWithCancel<T> extends Promise<T> {
  cancel: () => void
}

export interface UserInfo {
  id: string
  name: { last: string }
  picture: { large: string }
  desc: string
}

export function getUsersInfo(): PromiseWithCancel<UserInfo[]> {
  const controller = new AbortController()

  const __promise = new Promise<UserInfo[]>((resolve, reject) => {
    controller.signal.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'))
    })

    delay(300).then(() => {
      if (controller.signal.aborted) return

      const result = Mock.mock({
        'list|4-8': [
          {
            id: '@guid',
            name: {
              last: '@cname',
            },
            picture: {
              large: `https://i.pravatar.cc/150?img=@integer(1, 70)`,
            },
            desc: '@cparagraph(1, 2)',
          },
        ],
      })

      resolve(result.list as UserInfo[])
    })
  })

  const promise = __promise as PromiseWithCancel<UserInfo[]>
  promise.cancel = () => {
    controller.abort()
  }

  return promise
}
