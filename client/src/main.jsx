import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Provider } from 'react-redux'
import  store  from './redux/store.js'
import './index.css'




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
