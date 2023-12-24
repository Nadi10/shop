import Button from '@mui/joy/Button';
import Snackbar from '@mui/joy/Snackbar';
import { Typography } from '@mui/material';
import React from 'react';

interface ErrorSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ open, message, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <div style={{ color: 'black', padding: '50px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ fontWeight: 'xl', flex: 1 }}>{message}</Typography>
      <Button color="success" size="sm" onClick={onClose} sx={{ marginLeft: '10px' }}>
        Close
      </Button>
    </div>
  </Snackbar>
);

export default ErrorSnackbar;
