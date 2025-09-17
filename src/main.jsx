import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient} >
            <BrowserRouter>
                <App />
                <Toaster position='top-right' reverseOrder={false} />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)
