import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';

const SEYES_URL = 'https://educajou.forge.apps.education.fr/seyes/';

const SeyesBoard = ({ fullScreen = false, onToggleMenu, isMenuVisible }) => {
  const iframeRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProbablyBlocked, setIsProbablyBlocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) setIsProbablyBlocked(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  const openInNewTab = () => {
    window.open(SEYES_URL, '_blank', 'noopener');
  };

  const reloadIframe = () => {
    try {
      if (iframeRef.current) {
        iframeRef.current.src = SEYES_URL;
        setIsLoaded(false);
        setIsProbablyBlocked(false);
      }
    } catch (_) {}
  };

  return (
    <Box sx={{ height: fullScreen ? '100vh' : 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#2c3e50', fontWeight: 600 }}>
          Cahier Seyes interactif
        </Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={reloadIframe}>
          Recharger
        </Button>
        {fullScreen && (
          <Button variant="outlined" onClick={onToggleMenu}>
            {isMenuVisible ? 'Masquer menu' : 'Afficher menu'}
          </Button>
        )}
        <Button variant="contained" startIcon={<OpenInNewIcon />} onClick={openInNewTab}>
          Ouvrir dans un onglet
        </Button>
      </Stack>

      <Box sx={{ flexGrow: 1, borderRadius: 2, overflow: 'hidden', border: '1px solid #ecf0f1', position: 'relative', bgcolor: '#fff' }}>
        {!isLoaded && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7f8c8d', zIndex: 1 }}>
            <Typography>Chargement du cahier…</Typography>
          </Box>
        )}
        <iframe
          ref={iframeRef}
          title="Seyes"
          src={SEYES_URL}
          onLoad={() => setIsLoaded(true)}
          style={{ width: '100%', height: '100%', border: '0' }}
          allow="clipboard-write;"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
        />
      </Box>

      {isProbablyBlocked && (
        <Box sx={{ mt: 1, color: '#7f8c8d' }}>
          <Typography variant="body2">
            Si le cahier ne s'affiche pas, il est peut-être bloqué par le site distant. Cliquez sur « Ouvrir dans un onglet ».
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SeyesBoard;


