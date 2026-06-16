import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Muestra el scrollbar global solo mientras se hace scroll, lo oculta tras inactividad
let scrollTimer
window.addEventListener('scroll', () => {
  document.documentElement.classList.add('scrolling')
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    document.documentElement.classList.remove('scrolling')
  }, 1000)
}, { passive: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
