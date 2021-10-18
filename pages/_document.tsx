import React, { ReactElement } from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { upgradeElement } from '@ampproject/worker-dom'

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/* <canvas
            {...{
              src: '../lib/render.tsx',
              ref: (node) => node && upgradeElement(node, './dist/worker/worker.mjs'),
            }}
          /> */}
        </body>
      </Html>
    )
  }
}
