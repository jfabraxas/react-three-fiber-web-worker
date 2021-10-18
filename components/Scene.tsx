import * as React from 'react'
import * as THREE from 'three'
// import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from 'three-stdlib'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// OrbitControls.bind(globalThis)

export const Scene = () => {
  const [hover, setHover] = React.useState(false)
  const domElement = useThree((state) => state.events.connected)
  const scene = useThree((state) => state.scene)
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const controls = React.useMemo(() => domElement && new OrbitControls(camera, domElement), [camera, domElement])
  const meshRef = React.useRef<THREE.Mesh>()
  useFrame(({ clock }) => {
    controls.update()
    gl.render(scene, camera)
    // meshRef.current.rotation.x = clock.getElapsedTime()
  })
  return (
    <>
      <mesh
        {...{
          ref: meshRef,
          onPointerOver() {
            setHover(true)
          },
          onPointerOut() {
            setHover(false)
          },
        }}
      >
        <octahedronBufferGeometry />
        <meshBasicMaterial {...{ color: hover ? 'red' : 'green' }} />
      </mesh>
      {controls && (
        <primitive
          {...{
            object: controls,
            enabled: true,
            onUpdate: () => {
              console.log('UPDATE')
            },
          }}
        />
      )}
      {/* <OrbitControls {...{ domElement }} /> */}
    </>
  )
}
