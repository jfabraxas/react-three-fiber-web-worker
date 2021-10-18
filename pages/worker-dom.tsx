import * as React from 'react'
// import * as E from '@ampproject/worker-dom/src/worker-thread/Event'
import { attachWorker } from '../lib/attachWorker'
// import { attachWorker } from '@mizchi/worker-dom/dist/lib/main.mjs'
import { spawn, Worker, Transfer } from 'threads'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'

// const data = dynamic(import('../lib/render'))

const Page = () => {
  const ref = React.useRef<HTMLElement>()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const cRef = React.useRef()
  React.useEffect(() => {
    if (ref.current) {
      const load = async () => {
        // const workerBundle = new URL('../lib/render', import.meta.url)
        // const workerDom = new URL('@ampproject/worker-dom/dist/worker/worker.js', import.meta.url)

        // console.log('CURRENTT', new URL('../lib/render', import.meta.url))
        const worker = new Worker(new URL('../worker/render', import.meta.url), { name: 'test', type: 'module' })

        const spawned = await spawn(worker)
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        // const offscreenCanvas = (canvasRef.current as any).transferControlToOffscreen()
        // fetch('/_next/static/chunks/test.js').then(async (data) => console.log(await data.text()))
        // console.log(workerDom)
        // console.log(data)
        ref.current.setAttribute('src', '/_next/static/chunks/test.js')
        try {
          attachWorker(
            ref.current,
            worker //'https://cdn.skypack.dev/@ampproject/worker-dom/dist/worker/worker.mjs'
          )

          // await upgradedWorker.workerContext_.ready()
          // spawned.init(
          //   Transfer(
          //     {
          //       canvas: offscreenCanvas,
          //       size: { width: window.innerWidth, height: window.innerHeight },
          //     },
          //     [offscreenCanvas]
          //   )
          // )
          // upgradedWorker.workerContext_.worker.postMessage('hello')
        } catch (err) {
          console.log('Error', err)
        }

        // try {
        //   // spawned.render()
        // spawned.logger()
        // } catch (err) {
        //   console.log('ERROR on render: ', err)
        // }
      }

      load()
    }
  }, [])
  return (
    <div {...{ ref }}>
      Test the test
      <div {...{ id: 'root' }} />
      <Canvas>
        <mesh>
          <boxBufferGeometry />
          <meshNormalMaterial />
        </mesh>
      </Canvas>
      <canvas
        {...{
          ref: canvasRef,
          height: 500,
          widht: 500,
          id: 'canvas',
        }}
      />
    </div>
  )
}

export default Page
