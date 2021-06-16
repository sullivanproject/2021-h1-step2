import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Avatar from '../components/common/Avatar';
import ProfileUpdatePopup from '../components/ProfileUpdatePopup';
import { Divider, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '../components/common/Snackbar';
import { observer } from 'mobx-react';
import db from '../firestores/db';
import UserStore from '../firestores/UserStore';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
  primary: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  divider: {
    margin: theme.spacing(6, 0),
  },
  imgContainer: {
    overflow: 'hidden',
    width: '400px',
    height: '400px',
  },
  feedImg: {
    padding: theme.spacing(1),
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    '&:hover': {
      cursor: 'pointer',
      filter: 'brightness(70%)',
    },
  },
  profile: {
    paddingTop: '3rem',
  },
  container: {
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(0, 30),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0, 2),
    },
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
}));

const myFeed = observer(({ myFeed }) => {
  const classes = useStyles();

  const [user, setUser] = useState({});
  const [feedList, setFeedList] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    setUser({
      uid: UserStore.userinfo.uid,
      displayName: UserStore.userinfo.displayName,
      photoUrl: UserStore.userinfo.photoUrl,
      caption: UserStore.userinfo.caption,
      webpage: UserStore.userinfo.webpage,
      feedList: UserStore.userinfo.feedList,
      likeFeeds: UserStore.userinfo.likeFeeds,
    });
    getUserFeedList();
  }, []);

  async function getUserFeedList() {
    const feedRef = db.collection('feed');
    const feedSnapshot = await feedRef.get();
    const allFeedList = [];
    feedSnapshot.forEach((doc) => allFeedList.push(doc.data()));
    const myFeedList = [];
    allFeedList.forEach((feed) => {
      if (feed.author.uid === user.uid) myFeedList.push(feed);
    });
    setFeedList(myFeedList);
  }

  const openProfileUpdatePopup = () => {
    setPopupOpen(true);
  };
  const closeProfileUpdatePopup = () => {
    setPopupOpen(false);
  };

  // 스낵바 알림창
  const [resultMessageOpen, setResultMessageOpen] = useState(false);

  const openResultMessage = () => {
    setResultMessageOpen(true);
  };
  const closeResultMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setResultMessageOpen(false);
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='center'
        className={classes.profile}
        spacing={4}
      >
        <Grid item>
          <Avatar
            size={2}
            displayName={user.displayName}
            photoUrl={user.photoUrl}
          />
        </Grid>
        <Grid item>
          <Grid container direction='column'>
            <Grid item>
              <Typography variant='h6' component='h2' paragraph>
                {user.displayName}
              </Typography>
            </Grid>
            <Grid item>
              <Grid container direction='row' spacing={2}>
                <Grid item>
                  <Typography variant='body1' component='h2' paragraph>
                    게시물 {feedList.length}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1' component='h2' paragraph>
                    좋아하는 피드 수 {user.likeFeeds || 0}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant='caption' component='h2'>
                {user.caption}
              </Typography>
              <Typography
                variant='subtitle2'
                color='primary'
                component='h2'
                gutterBottom
              >
                {user.webpage}
              </Typography>
            </Grid>
            <Button
              variant='outlined'
              color='primary'
              onClick={openProfileUpdatePopup}
            >
              프로필 수정하기
            </Button>
            <ProfileUpdatePopup
              open={popupOpen}
              closeHandler={closeProfileUpdatePopup}
              openResultMessageHandler={openResultMessage}
              defaultUserInfo={user}
            />
            <Snackbar
              open={resultMessageOpen}
              closeHandler={closeResultMessage}
              message={'프로필이 수정되었습니다.'}
              durationProps={1000}
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider variant='middle' light className={classes.divider} />
      <Grid container spacing={3} className={classes.container}>
        {feedList.length !== 0 ? (
          feedList.map((feed, idx) => (
            <Grid item md={4} sm={6} xs={12} key={idx}>
              <div className={classes.imgContainer}>
                <Link href='/feed/[feedUid]' as={'/feed/' + feed.uid}>
                  <img
                    src={feed.photoUrl}
                    alt={feed.content}
                    className={classes.feedImg}
                  />
                </Link>
              </div>
            </Grid>
          ))
        ) : (
          <p>피드가 없습니다. 사진을 업로드하세요.</p>
        )}
      </Grid>
    </div>
  );
});

export default myFeed;
