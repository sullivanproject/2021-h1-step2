import React, { useEffect, useState, useRef } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import db from '../firestores/db';
import { v4 as uuidv4, v4 } from 'uuid';
import firebase from '../firestores/firebase';
import UserStore from '../firestores/UserStore';

const useStyles = makeStyles((theme) => ({
  primary: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
  },
  imgPreview: {
    width: '60%',
  },
}));

const edit = () => {
  const classes = useStyles();
  const router = useRouter();
  const { feedUid } = router.query;
  const uid = uuidv4();

  useEffect(() => {
    if (feedUid) {
      setUpdateMode(true);
      getFeedDetail();
    }
    setAuthor({
      displayName: UserStore.userinfo.displayName,
      photoUrl: UserStore.userinfo.photoUrl,
      uid: UserStore.userinfo.uid,
    });
  }, []);

  const [updateMode, setUpdateMode] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('');
  const [author, setAuthor] = useState({});
  const fileButton = useRef();

  const getPhotoUrl = () => {
    const file = fileButton.current.files[0];
    const storageRef = firebase.storage().ref(author.uid + '/' + uid);
    const task = storageRef.put(file);
    task.then((snapshot) => {
      const getUrl = snapshot.ref.getDownloadURL();
      getUrl.then((url) => {
        setPhotoUrl(url);
      });
    });
  };

  async function getFeedDetail() {
    try {
      const feedRef = db.collection('feed').doc(feedUid);
      const feedDoc = await feedRef.get();
      const feedDetail = feedDoc.data();
      setPhotoUrl(feedDetail.photoUrl);
      setContent(feedDetail.content);
      setLocation(feedDetail.location);
      setTag(feedDetail.tag);
    } catch (error) {
      console.log(error);
    }
  }

  async function submitHandler(event) {
    event.preventDefault();

    try {
      if (updateMode) {
        updateFeed();
      } else {
        await updateUserFeedList();
        await createFeed();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUserFeedList() {
    try {
      const userDocsRef = db.collection('user').doc(UserStore.userinfo.uid);
      const userDocs = await userDocsRef.get();
      const userFeedList = await userDocs.data().feedList;

      let newFeedList;
      if (userFeedList) {
        newFeedList = [...userFeedList, { feedId: uid }];
      } else {
        newFeedList = [{ feedId: uid }];
      }
      await userDocsRef.update({ feedList: newFeedList });
    } catch (error) {
      console.log(error);
    }
  }

  const createFeed = () => {
    const createData = {
      uid,
      photoUrl,
      content,
      location,
      tag,
      author,
      create_at: new Date(),
      like: 0,
    };

    try {
      db.collection('feed')
        .doc(uid)
        .set(createData)
        .then((res) => {
          router.push('/feed');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateFeed = () => {
    const updateData = {
      content,
      location,
      tag,
      author,
    };

    try {
      db.collection('feed')
        .doc(feedUid)
        .update(updateData)
        .then((res) => {
          router.push('/feed');
        });
    } catch (error) {
      console.log(error);
    }
  };

  const moveToFeedPage = () => {
    router.push('/feed');
  };

  return (
    <div>
      <Card variant='outlined'>
        <CardContent>
          <Grid container justify='center'>
            {photoUrl ? (
              <img
                src={photoUrl}
                alt='미리보기'
                className={classes.imgPreview}
              />
            ) : (
              '사진 미리보기'
            )}
          </Grid>
        </CardContent>
      </Card>
      <Card variant='outlined'>
        <CardContent>
          <form id='edit' className={classes.form} onSubmit={submitHandler}>
            {!updateMode && (
              <Grid container direction='row' alignItems='center'>
                <Grid item md={2} xs={12}>
                  <label htmlFor='file' className={classes.label}>
                    사진첨부
                  </label>
                </Grid>
                <Grid item md={10} xs={12}>
                  <input
                    id='file'
                    type='file'
                    ref={fileButton}
                    onChange={getPhotoUrl}
                    required
                  />
                </Grid>
              </Grid>
            )}
            <Grid container direction='row' alignItems='center'>
              <Grid item md={2} xs={12}>
                <label htmlFor='caption' className={classes.label}>
                  문구입력
                </label>
              </Grid>
              <Grid item md={10} xs={12}>
                <TextField
                  autoFocus
                  margin='dense'
                  id='caption'
                  multiline
                  variant='outlined'
                  placeholder='문구 입력...'
                  rows='4'
                  fullWidth
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <Grid container direction='row' alignItems='center'>
              <Grid item md={2} xs={12}>
                <label htmlFor='location' className={classes.label}>
                  위치 추가
                </label>
              </Grid>
              <Grid item md={10} xs={12}>
                <TextField
                  autoFocus
                  margin='dense'
                  id='location'
                  type='text'
                  variant='outlined'
                  placeholder='위치 추가'
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container direction='row' alignItems='center'>
              <Grid item md={2} xs={12}>
                <label htmlFor='tagging' className={classes.label}>
                  사람 태그
                </label>
              </Grid>
              <Grid item md={10} xs={12}>
                <TextField
                  autoFocus
                  margin='dense'
                  id='tagging'
                  type='text'
                  variant='outlined'
                  placeholder='태그하기'
                  fullWidth
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </Grid>
            </Grid>
            <CardActions>
              <Grid container justify='flex-end'>
                <Button size='large' onClick={moveToFeedPage}>
                  목록
                </Button>
                <Button
                  className={classes.primary}
                  size='large'
                  type='submit'
                  form='edit'
                >
                  공유
                </Button>
              </Grid>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default edit;
