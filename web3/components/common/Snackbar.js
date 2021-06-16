import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function SimpleSnackbar({
  message,
  open,
  closeHandler,
  durationProps,
}) {
  const [duration, setDuration] = useState(2000);

  const handleClose = () => {
    closeHandler();
  };

  useEffect(() => {
    setDuration(durationProps);
  }, []);

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={duration} // 2초동안 나타남
        onClose={handleClose}
        message={message}
        action={
          <>
            <Button color='primary' size='small' onClick={handleClose}>
              닫기
            </Button>
            <IconButton
              size='small'
              aria-label='close'
              color='inherit'
              onClick={handleClose}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          </>
        }
      />
    </div>
  );
}
