import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const startApplication = async () => {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK_API === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  createRoot(document.getElementById('root')).render(
    // <StrictMode>
      <App />
    // </StrictMode>,
  );
};

startApplication();
