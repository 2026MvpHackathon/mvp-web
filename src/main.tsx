import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'

// 콘솔 출력 비활성화
const noop = () => {}
;['log', 'error', 'warn', 'info', 'debug'].forEach(m => {
  if (typeof console !== 'undefined' && console[m]) {
    console[m] = noop
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
)

