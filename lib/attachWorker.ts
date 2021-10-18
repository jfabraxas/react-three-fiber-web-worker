/**
 *
 * https://github.com/ampproject/worker-dom/pull/855/files#diff-7ac81c10b121502a1b7c747c55a0518fbdc4d57a74504453459bfb138ef375a3
 */

import {
  MutationFromWorker,
  MessageType,
  MessageFromWorker,
  MessageToWorker,
} from '@ampproject/worker-dom/src/transfer/Messages'
import { MutatorProcessor } from '@ampproject/worker-dom/src/main-thread/mutator'
import { NodeContext } from '@ampproject/worker-dom/src/main-thread/nodes'
import { StringContext } from '@ampproject/worker-dom/src/main-thread/strings'
import { TransferrableKeys } from '@ampproject/worker-dom/src/transfer/TransferrableKeys'
import {
  InboundWorkerDOMConfiguration,
  WorkerDOMConfiguration,
} from '@ampproject/worker-dom/src/main-thread/configuration'
import { normalizeConfiguration } from '@ampproject/worker-dom/src/main-thread/configuration'
import type { WorkerContext } from '@ampproject/worker-dom/src/main-thread/worker'
import { ObjectContext } from '@ampproject/worker-dom/src/main-thread/object-context'
import { readableMessageToWorker, readableHydrateableRootNode } from '@ampproject/worker-dom/src/main-thread/debugging'
import { createHydrateableRootNode } from '@ampproject/worker-dom/src/main-thread/serialize'

const ALLOWABLE_MESSAGE_TYPES = [MessageType.MUTATE, MessageType.HYDRATE]

const WORKER_DOM_DEBUG = true

export function attachWorker(
  baseElement: HTMLElement,
  worker: Worker,
  config: InboundWorkerDOMConfiguration = {
    authorURL: '[external-instance]',
    domURL: '[external-instance]',
  }
) {
  const stringContext = new StringContext()
  const objectContext = new ObjectContext()
  const nodeContext = new NodeContext(stringContext, baseElement)
  const normalizedConfig = normalizeConfiguration(config)

  const workerContext = new WorkerContextFromInstance(
    baseElement as HTMLElement,
    nodeContext,
    worker,
    normalizedConfig
  ) as any as WorkerContext
  const mutatorContext = new MutatorProcessor(
    stringContext,
    nodeContext,
    workerContext,
    normalizedConfig,
    objectContext
  )

  workerContext.worker.onmessage = (message: MessageFromWorker) => {
    const { data } = message
    if (!ALLOWABLE_MESSAGE_TYPES.includes(data[TransferrableKeys.type])) {
      return
    }
    mutatorContext.mutate(
      (data as MutationFromWorker)[TransferrableKeys.phase],
      (data as MutationFromWorker)[TransferrableKeys.nodes],
      (data as MutationFromWorker)[TransferrableKeys.strings],
      new Uint16Array(data[TransferrableKeys.mutations])
    )

    if (config.onReceiveMessage) {
      config.onReceiveMessage(message)
    }
  }
}

class WorkerContextFromInstance {
  private [TransferrableKeys.worker]: Worker
  private nodeContext: NodeContext
  private config: WorkerDOMConfiguration

  /**
   * @param baseElement
   * @param nodeContext
   * @param workerDOMScript
   * @param authorScript
   * @param config
   */
  constructor(baseElement: HTMLElement, nodeContext: NodeContext, worker: Worker, config: WorkerDOMConfiguration) {
    const selfAsWorkerContext = this as any as WorkerContext
    this.nodeContext = nodeContext
    this.config = config

    const { skeleton, strings } = createHydrateableRootNode(baseElement, config, selfAsWorkerContext)
    const cssKeys: Array<string> = []
    const globalEventHandlerKeys: Array<string> = []
    // TODO(mizchi): Can not serialize on postMessage
    // TODO(choumx): Sync read of all localStorage and sessionStorage a possible performance bottleneck?
    // const localStorageData = config.sanitizer ? config.sanitizer.getStorage(StorageLocation.Local) : window.localStorage;
    // const sessionStorageData = config.sanitizer ? config.sanitizer.getStorage(StorageLocation.Session) : window.sessionStorage;

    for (const key in baseElement.style) {
      cssKeys.push(key)
    }
    for (const key in baseElement) {
      if (key.startsWith('on')) {
        globalEventHandlerKeys.push(key)
      }
    }

    this[TransferrableKeys.worker] = worker
    worker.postMessage({
      __init__: [
        strings,
        skeleton,
        cssKeys,
        globalEventHandlerKeys,
        [window.innerWidth, window.innerHeight],
        {}, // localStorage
        {}, // sessionStorage
      ],
    })

    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'hydratedNode', readableHydrateableRootNode(baseElement, config, selfAsWorkerContext))
    }
    if (config.onCreateWorker) {
      config.onCreateWorker(baseElement, strings, skeleton, cssKeys)
    }
  }

  /**
   * Returns the private worker.
   */
  get worker(): Worker {
    return this[TransferrableKeys.worker]
  }

  /**
   * @param message
   */
  messageToWorker(message: MessageToWorker, transferables?: Transferable[]) {
    if (WORKER_DOM_DEBUG) {
      console.info('debug', 'messageToWorker', readableMessageToWorker(this.nodeContext, message))
    }
    if (this.config.onSendMessage) {
      this.config.onSendMessage(message)
    }
    this.worker.postMessage(message, transferables || [])
  }
}
