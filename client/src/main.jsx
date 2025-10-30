import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./context/ThemeContext.jsx";

import { store } from './redux/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <ThemeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
  </StrictMode>,
)
