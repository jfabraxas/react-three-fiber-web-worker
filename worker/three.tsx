import { expose } from 'threads/worker';
import * as React from 'react';
import * as THREE from 'three';
import { render as renderer, events } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { names } from '../events'

let offscreenCanvas

const init = ({ canvas, size }) => {
  offscreenCanvas = canvas
  offscreenCanvas['style'] = { width: `${size?.width || 0}px`, height: `${size?.height || 0}px`}
}

const handlers = {}

const eventHandlers = Object.entries(names).reduce((prev, [n1,[n2]]) => ({
  ...prev,
  [n1]:(event) => {
    console.log("worker",n1,n2,event)
    handlers[n1]?.(event)
  },
  [n2]:(event) => {
    console.log("worker",n1,n2,event)
    handlers[n1]?.(event)
  },
}),{})

let connected =false

const render = ({ size }) => {
  try {
    renderer(
      <mesh {...{ onClick: () => { console.log("CLICKER WORKS" )}}}>
        <boxBufferGeometry />
        <meshNormalMaterial />
      </mesh>,
      offscreenCanvas,
      {
        size: { width: size.width || 900, height: size.height || 900 },
        events: (store) => {
          const es = events(store)
          Object.entries(events?.handlers ?? []).forEach(([name, event]) => {
            const [eventName, passive] = names[name as keyof typeof names]
            handlers[eventName] = (event) => {
              console.log(eventName, " in worker", event)
              es.handlers[name](event)
            }
          })
          return {...es, handlers, connected: true}
        },
      }
    );
  } catch (err) {
    console.log('ERROR', err);
  }
};


expose({ render, init, ...eventHandlers });
