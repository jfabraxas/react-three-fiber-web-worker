import { expose } from 'threads/worker'
import * as React from 'react'
import * as THREE from 'three'
import { render as renderer, events } from '@react-three/fiber'
import { Sphere, OrbitControls } from '@react-three/drei'
import { names } from '../events'
import { Scene } from '../components/Scene'
// import {  } from '@ampproject/worker-dom/dist/worker/worker'

let offscreenCanvas
const handlers = {}

const init = ({ canvas, size }) => {
  offscreenCanvas = canvas
  offscreenCanvas['style'] = { width: `${size?.width || 0}px`, height: `${size?.height || 0}px` }
}

const eventHandlers = Object.entries(names).reduce(
  (prev, [n1, [n2]]) => ({
    ...prev,
    [n1]: (event) => {
      handlers[n2]?.(event)
    },
    [n2]: (event) => {
      handlers[n2]?.(event)
    },
  }),
  {}
)

let SIZE = { width: 100, height: 100 }

const render = ({ size } = { size: SIZE }) => {
  SIZE = size
  try {
    renderer(<Scene />, offscreenCanvas, {
      size,
      onCreated: (state) => {
        const store = {
          getState() {
            return state.get()
          },
        }
        const target = {
          style: { touchAction: true },
          ownerDocument: { removeEventListener() {} },
          removeEventListener(eventName, eventHandler) {
            console.log('REMOVE', eventName)
          },
          addEventListener(eventName, event) {
            handlers[eventName] = (e) => {
              event(e)
            }
          },
        }
        try {
          const e = events(store as any)
          state.set((state) => ({ events: e }))
          state.get().events.connect(target)
          // console.log(state.get().events)
          // state.set((state) => ({ events: { ...e, connected: target } }))
        } catch (err) {
          console.log('ERROPRP', err)
        }
        // console.log(store.getState())
        // state.events.connect(target)s
        // console.log(state.get())
        // const es = events(store as any)
        // // console.log('es', state.events)
        // Object.entries(es?.handlers ?? []).forEach(([name, event]) => {
        //   const [eventName, passive] = names[name as keyof typeof names]
        //   handlers[name] = (event) => {
        //     eventName === 'click' && console.log(eventName, ' in worker', event, state)
        //     es.handlers[name](event)
        //   }
        // })
        // state.events.set({ ...es, handlers, connected: true })
        // return { ...es, handlers, connected: true }
      },
    })
  } catch (err) {
    console.log('ERROR', err)
  }
}

const exposeContent = { render, init, ...eventHandlers }

expose(exposeContent)
