import { StrictMode } from 'react';
import { BrowserRouter } from "react-router-dom"; 
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { WatchlistProvider } from './Components/WatchlistProvider'; 
import { NotificationProvider } from "./Components/NotificationProvider";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <WatchlistProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WatchlistProvider>
    </NotificationProvider>
  </StrictMode>,
);
