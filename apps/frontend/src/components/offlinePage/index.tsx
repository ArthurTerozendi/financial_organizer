import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { WifiOff, Refresh } from '@mui/icons-material';

interface OfflinePageProps {
  onRetry?: () => void;
}

const OfflinePage: React.FC<OfflinePageProps> = ({ onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <WifiOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom>
          Você está offline
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Parece que você perdeu a conexão com a internet. 
          Algumas funcionalidades podem não estar disponíveis.
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRetry}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Dados salvos localmente ainda estão disponíveis
        </Typography>
      </Paper>
    </Box>
  );
};

export default OfflinePage;
