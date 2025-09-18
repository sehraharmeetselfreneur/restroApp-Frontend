import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css'
import App from './App.jsx'

import CustomToaster from './components/CustomToaster.jsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        }
    }
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient} >
            <BrowserRouter>
                <App />
                <CustomToaster />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
)
