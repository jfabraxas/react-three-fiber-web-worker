import { expose } from 'threads/worker';
import * as React from 'react';
import * as THREE from 'three';
import { render as renderer } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

let offscreenCanvas

const init = ({ canvas, size }) => {
  offscreenCanvas = canvas
  offscreenCanvas['style'] = { width: `${size?.width || 0}px`, height: `${size?.height || 0}px` }
 
  }

const render = ({ size }) => {
  try {
    renderer(
      <mesh>
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

expose({ render, init });
