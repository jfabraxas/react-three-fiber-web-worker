import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { expose } from 'threads/worker'
import * as THREE from 'three'
import { ready } from '../lib/ready'
import 'raf/polyfill'
// import { ready } from '@mizchi/worker-dom/dist/lib/worker.mjs'
import { render as rf3render, Props, unmountComponentAtNode } from '@react-three/fiber'

import { Sphere } from '@react-three/drei'

import { OffscreenCanvasPolyfill } from '@ampproject/worker-dom/src/worker-thread/canvas/OffscreenCanvasPolyfill'
import { SVGRenderer } from 'three-stdlib'
import useMeasure from 'react-use-measure'
// import { propagate } from '@ampproject/worker-dom/src/worker-thread/Event'
// rf3render(<Sphere />, canvas, {
//   onCreated: (state) => {
//     console.log('DOES THIS WORK?')
//   },
// })

function Canvas({ children, resize, style, className, ...props }: Props) {
  // const [bind, size] = useMeasure({ scroll: true, debounce: { scroll: 50, resize: 0 }, ...resize })
  const ref = React.useRef<HTMLDivElement>(null!)
  const [gl] = React.useState(() => new SVGRenderer() as unknown as THREE.WebGLRenderer)

  React.useLayoutEffect(() => {
    rf3render(children, ref.current, { ...props, gl })
  }, [gl, children])

  // React.useEffect(() => {
  //   const container = ref.current
  //   container.appendChild(gl.domElement)
  //   return () => {
  //     container.removeChild(gl.domElement)
  //     unmountComponentAtNode(container)
  //   }
  // }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden', ...style }}
    />
  )
}

function TorusKnot() {
  let ref = React.useRef<THREE.Mesh>(null!)
  let t = 0
  // useFrame(() => {
  //   ref.current.rotation.set(t, t, t)
  //   t += 0.001
  // })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry attach='geometry' args={[10, 3, 100, 16]} />
      <meshBasicMaterial attach='material' color='hotpink' />
    </mesh>
  )
}

const Hover = () => {
  const [hover, setHover] = React.useState(false)
  return (
    <>
      <div
        {...{
          style: { color: hover ? 'red' : 'green' },
          onMouseOver: () => {
            setHover(true)
          },
          onMouseLeave: () => {
            setHover(false)
          },
        }}
      >
        Hello from Worker
      </div>
    </>
  )
}

let canvas
let isReady = false

const render = () => {
  try {
    const div = document.getElementById('root')
    canvas = document.getElementById('canvas')
    const newDiv = document.createElement('div')
    newDiv.style.setProperty("width", "500px")
    newDiv.style.setProperty("height", "500px")
    newDiv.style.setProperty("background-color", "grey")
    const gl = new SVGRenderer()
    document.body.appendChild(newDiv)
    rf3render(<TorusKnot />, newDiv, {
      gl,
      size: { width: 100, height: 100 },
      camera: { position: [0, 0, 50] },
    })
    newDiv.appendChild(gl.domElement)
    const p = new OffscreenCanvasPolyfill(canvas)
    // div.appendChild(newCanvas)
    const r3f = document.getElementsByTagName('canvas')[0]
    const ctx = p.getContext?.('2d')
    ctx.drawImage(r3f, 0, 0)
    ReactDOM.render(<Hover />, div)
    // rf3render(<Sphere />, canvas, {
    //   onCreated: (state) => {
    //     console.log('DOES THIS WORK?')
    //   },
    // })
    // console.log(self)
  } catch (err) {
    console.log('ERROR', err)
  }
}

const logger = () => {
  console.log(canvas)
  try {
    console.log(document)
  } catch (err) {
    console.log('ERROR', err)
  }
}
// exportFunction('logger', logger)
let offscreenCanvas

const r3fInit = ({ canvas, size }) => {
  offscreenCanvas = canvas
  offscreenCanvas['style'] = { width: `${size?.width || 0}px`, height: `${size?.height || 0}px` }
}
const r3f = () => {}

async function run() {
  await ready
  isReady = true
  render()
}

run()
expose({ render, logger, r3f, r3fInit })
function mergeRefs(
  arg0: (((element: HTMLElement | SVGElement) => void) | React.MutableRefObject<HTMLDivElement>)[]
): React.LegacyRef<HTMLDivElement> {
  throw new Error('Function not implemented.')
}
