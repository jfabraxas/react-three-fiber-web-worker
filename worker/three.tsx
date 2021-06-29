import { expose } from 'threads/worker';
import * as React from 'react';
import * as THREE from 'three';
import { render as renderer } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const render = ({ canvas, size }) => {
  try {
    canvas['style'] = { width: '100px', height: '100px' };
    renderer(
      <mesh {...{ ref: console.log }}>
        <boxBufferGeometry />
        <meshNormalMaterial />
      </mesh>,
      canvas,
      {
        size: { width: size.width || 900, height: size.height || 900 },
        onCreated: state => {
          console.log('CREATED');
        }
      }
    );
  } catch (err) {
    console.log('ERROR', err);
  }
};

expose({ render });
