import { expose } from 'threads/worker';
import * as React from 'react';
import * as THREE from 'three';
import { render as renderer } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const render = ({ canvas, size }) => {
  try {
    canvas['style'] = { width: `${size?.width || 0}px`, height: `${size?.height || 0}px` };
    renderer(
      <mesh {...{ ref: console.log }}>
        <boxBufferGeometry />
        <meshNormalMaterial />
      </mesh>,
      canvas,
      {
        size: { width: size.width || 900, height: size.height || 900 },
      }
    );
  } catch (err) {
    console.log('ERROR', err);
  }
};

expose({ render });
