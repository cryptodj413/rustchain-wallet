// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { WalletProvider } from './context/WalletContext.tsx'
import { Buffer } from 'buffer';
window.Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <HashRouter>
    <WalletProvider>
      <App />
    </WalletProvider>
  </HashRouter>
  // </StrictMode>
)
