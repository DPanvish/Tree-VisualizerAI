// Importing necessary libraries and components
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import './index.css';

// --- Application Entry Point ---

// The root DOM element where the React application will be mounted.
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Renders the main application component into the DOM.
root.render(
  <StrictMode>
    {/* Provides the Redux store to the entire application. */}
    <Provider store={store}>
      {/* Provides theme context (e.g., light/dark mode) to the application. */}
      <ThemeProvider>
        {/* Enables client-side routing for the application. */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
