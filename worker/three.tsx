import { expose } from 'threads/worker';
import * as React from 'react';
import * as THREE from 'three';
import { render as renderer, events } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

let offscreenCanvas

const init = ({ canvas, size }) => {
  console.log(canvas)
  offscreenCanvas = canvas
  offscreenCanvas['style'] = { width: `${size?.width || 0}px`, height: `${size?.height || 0}px`}
}

const handlers = {}

const eventHandlers = {
  onClick: ['click', false],
  onContextMenu: ['contextmenu', false],
  onDoubleClick: ['dblclick', false],
  onWheel: ['wheel', true],
  onPointerDown: ['pointerdown', true],
  onPointerUp: ['pointerup', true],
  onPointerLeave: ['pointerleave', true],
  onPointerMove: ['pointermove', true],
  onPointerCancel: ['pointercancel', true],
  onLostPointerCapture: ['lostpointercapture', true]
}
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
            handlers[eventName] = (event) => es.handlers[name](event)
          })
          return {...es, connected}
        },
      }
    );
  } catch (err) {
    console.log('ERROR', err);
  }
};

const onClick = (event) => { console.log(event)}

expose({ render, init, onClick, handlers:eventHandlers });
