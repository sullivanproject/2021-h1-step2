import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { LockOutlinedIcon } from '@material-ui/icons';
import { observer } from 'mobx-react';
import db from '../firestores/db';
import firebase from '../firestores/firebase';
import UserStore from '../firestores/UserStore';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    marginTop: theme.spacing(20),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// 로그인 버튼 클릭시 firebase 와 로그인 연결
const loginfuntion = () => {
  var count = 0;
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      const provider = new firebase.auth.GoogleAuthProvider();
      // 파이어 베이스가 셰션에 유지 되어 있는지 확인
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          db.collection('user')
            .get()
            .then((answer) => {
              answer.forEach((element) => {
                if (element.data().uid == user.uid) {
                  count = count + 1;
                  UserStore.userinfo = {
                    uid: element.data().uid,
                    displayName: element.data().displayName,
                    photoUrl: element.data().photoUrl,
                    webpage: element.data().webpage,
                    caption: element.data().caption,
                    likeFeeds: element.data().likeFeeds,
                    feedList: element.data().feedList,
                  };
                }
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          firebase
            .auth()
            .signInWithPopup(provider)
            .then(function (result) {
              db.collection('user')
                .get()
                // user db 중 uid 가 같은 것이 있나 탐색(같은 것이 있을 경우 이미 회원가입 된 유저)
                .then((answer) => {
                  answer.forEach((element) => {
                    if (element.data().uid == result.user.uid) {
                      count = count + 1;
                      UserStore.userinfo = {
                        uid: element.data().uid,
                        displayName: element.data().displayName,
                        photoUrl: element.data().photoUrl,
                        webpage: element.data().webpage,
                        caption: element.data().caption,
                        likeFeeds: element.data().likeFeeds,
                        feedList: element.data().feedList,
                      };
                    }
                  });

                  if (count == 0) {
                    // 새로운 사용자
                    UserStore.userinfo = {
                      uid: result.user.uid,
                      displayName: result.user.displayName,
                      photoUrl: result.user.photoURL,
                      webpage: '',
                      caption: '',
                      likeFeeds: '',
                      feedList: [],
                    };
                    db.collection('user')
                      .doc(result.user.uid)
                      .set(UserStore.userinfo)
                      .then((res) => {
                        console.log('login success');
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                })
                .catch((error) => {
                  alert('error' + error.message);
                  console.log(error);
                });
            })
            .catch((error) => {
              alert('login error:' + error.message);
              console.log(error);
            });
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const login = observer(({ login }) => {
  const classes = useStyles();
  const router = useRouter();
  if (UserStore.userinfo != null) {
    router.push('/');
  }
  return (
    <div>
      {UserStore.userinfo == null && (
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sullivan-SNS
            </Typography>
            <form className={classes.form} noValidate>
              <Button
                fullWidth
                variant='contained'
                size='small'
                color='primary'
                onClick={loginfuntion}
              >
                <Avatar src='images/google.png' className={classes.avatar} />
                <Typography component='p' variant='h6'>
                  Sign in with Google
                </Typography>
              </Button>

              <Box mt={8}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Container>
      )}
    </div>
  );
});

export default login;
