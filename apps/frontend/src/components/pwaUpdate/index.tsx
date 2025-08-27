import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { Update, Close } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const PWAUpdate: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const location = useLocation();

  // Don't show update prompt on auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signUp';
  const isAuthenticated = !!localStorage.getItem('jwtToken');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker activated
        window.location.reload();
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdatePrompt(false);
  };

  const handleClose = () => {
    setShowUpdatePrompt(false);
  };

  // Listen for service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                
                // Only show update prompt if user is authenticated and not on auth pages
                if (isAuthenticated && !isAuthPage) {
                  // Add a small delay to prevent flickering
                  setTimeout(() => {
                    setShowUpdatePrompt(true);
                  }, 1000);
                }
              }
            });
          }
        });
      });
    }
  }, [isAuthenticated, isAuthPage]);

  // Don't show on auth pages or if not authenticated
  if (isAuthPage || !isAuthenticated || !showUpdatePrompt) {
    return null;
  }

  return (
    <Snackbar
      open={showUpdatePrompt}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: { xs: 16, sm: 24 } }}
    >
      <Alert
        severity="info"
        action={
          <>
            <Button
              color="inherit"
              size="small"
              startIcon={<Update />}
              onClick={handleUpdate}
              sx={{ mr: 1 }}
            >
              Atualizar
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <Close />
            </Button>
          </>
        }
        sx={{ width: '100%' }}
      >
        Nova versão disponível! Atualize para obter as últimas melhorias.
      </Alert>
    </Snackbar>
  );
};

export default PWAUpdate;
