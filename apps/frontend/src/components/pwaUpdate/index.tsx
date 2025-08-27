import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { Update, Close } from '@mui/icons-material';

const PWAUpdate: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

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
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      });
    }
  }, []);

  if (!showUpdatePrompt) {
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
