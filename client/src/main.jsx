import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {ThemeProvider} from "./context/ThemeContext.jsx";

// We will set up the Redux store here later
// import { Provider } from 'react-redux'
// import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
