import Head from 'next/head';
import * as React from 'react';
import styles from '../styles/Home.module.css';
import { spawn, Worker, Transfer, Thread } from 'threads';
import dynamic from 'next/dynamic';

export default function Home() {
  const workerRef = React.useRef();
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const load = async () => {
      if (workerRef.current) return;
      workerRef.current = await spawn(
        new Worker(new URL('../worker/three', import.meta.url))
      );
    };
    const render = () => {
      if (canvasRef.current && workerRef.current) {
        workerRef.current.render({
          size: { width: window.innerWidth, height: window.innerHeight }
        });
      }
    };
    load().then(() => {
      const canvas = canvasRef.current.transferControlToOffscreen();
      workerRef.current.init(
        Transfer(
          {
            canvas,
            size: { width: window.innerWidth, height: window.innerHeight }
          },
          [canvas]
        )
      );
    });
    if (window) {
      window.addEventListener('resize', render);
    }
    return () => {
      window.removeEventListener('resize', render);
      workerRef.current && Thread.terminate(workerRef.current);
    };
  }, []);

  React.useEffect(() => {
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
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
              boxSizing: 'border-box'
            },
            ref: canvasRef
          }}
        />
      </main>
      <footer className={styles.footer} />
    </div>
  );
}
