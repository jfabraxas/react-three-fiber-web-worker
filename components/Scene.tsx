import * as React from 'react'

export const Scene = () => {
  const [hover, setHover] = React.useState(false)
  return (
    <mesh
      {...{
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
  )
}
