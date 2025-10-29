'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/auth-guard';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Provider store={store}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Provider>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Provider store={store}>
          <AuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
