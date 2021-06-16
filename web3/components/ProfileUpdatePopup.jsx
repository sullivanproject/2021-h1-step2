import React, { useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from './common/Avatar';
import { Divider, Grid, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import db from '../firestores/db';
import firebase from '../firestores/firebase';
import UserStore from '../firestores/UserStore';
import { v4 as uuidv4, v4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  primary: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  link: {
    cursor: 'pointer',
    margin: '1rem 0',
    color: '#2196f3',
    fontWeight: 'bold',
  },
  formGroup: {
    padding: '2rem',
  },
  label: {
    fontWeight: 'bold',
  },
}));

export default function ProfileUpdatePopup({
  open,
  closeHandler,
  openResultMessageHandler,
  defaultUserInfo,
}) {
  const classes = useStyles();

  const [photoUrl, setPhotoUrl] = useState(defaultUserInfo.photoUrl);
  const [displayName, setDisplayName] = useState(defaultUserInfo.displayName);
  const [webpage, setWebpage] = useState(defaultUserInfo.webpage);
  const [caption, setCaption] = useState(defaultUserInfo.caption);
  const fileButton = useRef();
  const uid = uuidv4();

  const getPhotoUrl = () => {
    const file = fileButton.current.files[0];
    const storageRef = firebase
      .storage()
      .ref(UserStore.userinfo.uid + '/' + uid);
    const task = storageRef.put(file);
    task.then((snapshot) => {
      const getUrl = snapshot.ref.getDownloadURL();
      getUrl.then((url) => {
        setPhotoUrl(url);
      });
    });
  };

  const handleClose = () => {
    closeHandler();
  };

  async function submitHandler(event) {
    event.preventDefault();

    const profileData = {
      photoUrl,
      displayName,
      webpage,
      caption,
    };
    try {
      await updateUserProfile(profileData);
      handleClose();
      openResultMessageHandler();
    } catch (error) {
      console.log(error);
    }
  }

  const updateUserProfile = (profileData) => {
    db.collection('user')
      .doc(UserStore.userinfo.uid)
      .update(profileData)
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogContent>
          <form id='profileUpdate' onSubmit={submitHandler}>
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
            >
              <Avatar displayName={displayName} photoUrl={photoUrl} />
              <Link component='label' className={classes.link} underline='none'>
                프로필 사진 바꾸기
                <input
                  type='file'
                  hidden
                  ref={fileButton}
                  onChange={getPhotoUrl}
                />
              </Link>
            </Grid>
            <Divider variant='middle' light />
            <div className={classes.formGroup}>
              <Grid container direction='row' alignItems='center'>
                <Grid item md={2} xs={12}>
                  <label htmlFor='userName' className={classes.label}>
                    사용자 이름
                  </label>
                </Grid>
                <Grid item md={10} xs={12}>
                  <TextField
                    id='userName'
                    type='text'
                    value={displayName}
                    placeholder='사용자 이름'
                    margin='dense'
                    variant='outlined'
                    fullWidth
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid container direction='row' alignItems='center'>
                <Grid item md={2} xs={12}>
                  <label htmlFor='webPage' className={classes.label}>
                    웹사이트
                  </label>
                </Grid>
                <Grid item md={10} xs={12}>
                  <TextField
                    id='webPage'
                    type='text'
                    value={webpage}
                    placeholder='웹사이트'
                    autoFocus
                    margin='dense'
                    variant='outlined'
                    fullWidth
                    onChange={(e) => setWebpage(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid container direction='row' alignItems='center'>
                <Grid item md={2} xs={12}>
                  <label htmlFor='caption' className={classes.label}>
                    소개
                  </label>
                </Grid>
                <Grid item md={10} xs={12}>
                  <TextField
                    id='caption'
                    multiline
                    value={caption}
                    placeholder='소개'
                    autoFocus
                    margin='dense'
                    variant='outlined'
                    rows='4'
                    fullWidth
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </Grid>
              </Grid>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size='large'>
            취소
          </Button>
          <Button
            className={classes.primary}
            size='large'
            type='submit'
            form='profileUpdate'
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
