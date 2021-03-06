import Head from 'next/head'
import * as React from 'react'
import styles from '../styles/Home.module.css'
import { spawn, Worker, Transfer, Thread } from 'threads'
import dynamic from 'next/dynamic'
import { names } from '../events'

export default function Home() {
  const workerRef = React.useRef(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    const load = async () => {
      if (workerRef.current) return
      // @ts-ignore
      workerRef.current = await spawn(new Worker(new URL('../worker/three', import.meta.url)))
    }
    const render = () => {
      if (canvasRef.current && workerRef.current) {
        workerRef.current.render({
          size: { width: window.innerWidth, height: window.innerHeight },
        })
        Object.entries(names).forEach(([name, [eventName, passive]]) => {
          canvasRef.current.addEventListener(
            eventName,
            (event: PointerEvent) => {
              if (workerRef.current?.[name]) {
                eventName === 'click' && console.log(event)
                workerRef.current[name]({
                  width: event.width,
                  height: event.height,
                  clientX: event.clientX,
                  clientY: event.clientY,
                  offsetX: event.offsetX,
                  offsetY: event.offsetY,
                  type: event.type,
                  pointerId: event.pointerId,
                  pointerType: event.pointerType,
                  x: event.x,
                  y: event.y,
                  screenX: event.screenX,
                  screenY: event.screenY,
                  pageX: event.pageX,
                  pageY: event.pageY,
                  movementX: event.movementX,
                  movementY: event.movementY,
                  tiltX: event.tiltX,
                  ctrlKey: event.ctrlKey,
                  altKey: event.altKey,
                  metaKey: event.metaKey,
                  shiftKey: event.shiftKey,
                  detail: event.detail,
                  // view: event.view,
                  tangentialPressure: event.tangentialPressure,
                  timeStamp: event.timeStamp,
                } as Partial<PointerEvent>)
              }
            },
            passive
          )
        })
      }
    }
    load().then(() => {
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
      const canvas = (canvasRef.current as any).transferControlToOffscreen()
      workerRef.current.init(
        Transfer(
          {
            canvas,
            size: { width: window.innerWidth, height: window.innerHeight },
          },
          [canvas]
        )
      )

      render()
    })
    if (window) {
      window.addEventListener('resize', render)
    }
    return () => {
      window.removeEventListener('resize', render)
      workerRef.current && Thread.terminate(workerRef.current)
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href='https://nextjs.org'>Next.js!</a>
        </h1>
        <canvas
          {...{
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: '1px solid red',
              boxSizing: 'border-box',
            },
            ref: canvasRef,
          }}
        />
      </main>
      <footer className={styles.footer} />
    </div>
  )
}
