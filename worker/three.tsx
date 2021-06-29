import { expose } from 'threads/worker';
import * as React from 'react';
import * as THREE from 'three';
import { render as renderer } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const init = ({ width, heigh, canvas }) => {
  const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
  camera.position.z = 200;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x444466);

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(5, 8);
  const material = new THREE.MeshNoramlMaterial({ color: 0xaa24df });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setSize(width, height, false);
  renderer.render(scene, camera);

  animate({ renderer, group });
};

function animate({ renderer, group }) {
  // group.rotation.x = Date.now() / 4000;
  group.rotation.y = -Date.now() / 4000;

  renderer.render(scene, camera);

  if (self.requestAnimationFrame) {
    self.requestAnimationFrame(animate);
  } else {
    // Firefox
  }
}

class Renderer extends THREE.WebGLRenderer {
  setSize(width, height) {
    console.log('SET SIZE');
    this.super.setSize(width, height, false);
  }
}

const render = ({ canvas, size }) => {
  console.log('CANVAS', canvas.width, requestAnimationFrame, size);
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
  console.log('RENDER', canvas);
};

expose({ render });
