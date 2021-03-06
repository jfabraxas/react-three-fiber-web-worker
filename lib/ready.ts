import { hydrate, workerDOM } from '@ampproject/worker-dom/src/worker-thread'
import { TransferrableKeys } from '@ampproject/worker-dom/src/transfer/TransferrableKeys'
import { HydrateableNode } from '@ampproject/worker-dom/src/transfer/TransferrableNodes'

// @ts-ignore
self.window = self

let _resolve: Function | null = null
export const ready = new Promise((resolve) => {
  _resolve = resolve
})

self.addEventListener(
  'message',
  (ev: any) => {
    const args = ev.data.__init__ as [
      string[],
      HydrateableNode,
      string[],
      string[],
      [number, number],
      { [key: string]: string },
      { [key: string]: string }
    ]
    hydrate(workerDOM.document, ...args)

    workerDOM.document[TransferrableKeys.observe]()
    Object.keys(workerDOM).forEach((k) => {
      // @ts-ignore
      self[k] = workerDOM[k]
    })
    _resolve && _resolve()
  },
  { once: true }
)
