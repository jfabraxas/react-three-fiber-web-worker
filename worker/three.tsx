import { expose } from 'threads/worker';
import * as React from 'react';
import * as THREE from 'three';
import { render as renderer } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

let offscreenCanvas

const init = ({ canvas, size }) => {
  console.log(canvas)
  offscreenCanvas = canvas
  offscreenCanvas['style'] = { width: `${size?.width || 0}px`, height: `${size?.height || 0}px`}
}

const handlers = {}
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
      }
    );
  } catch (err) {
    console.log('ERROR', err);
  }
};

const onClick = (event) => { console.log(event)}

expose({ render, init, onClick, handlers });
