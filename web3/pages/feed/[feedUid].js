import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { Paper, TextField, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '../../components/common/Avatar';
import DetailFeed from '../../components/DetailFeed';
import Comment from '../../components/Comment';
import SendIcon from '@material-ui/icons/Send';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import db from '../../firestores/db';
import UserStore from '../../firestores/UserStore';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
  },
  commentItem: {
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'left',
  },
}));

const detail = observer(({ detail }) => {
  const classes = useStyles();
  const router = useRouter();
  const { feedUid } = router.query;

  const [feed, setFeed] = useState({});
  const [user, setUser] = useState({});
  const [inputs, setInputs] = useState({ comment: '' });
  const comments = [
    {
      id: 1,
      username: 'aeuna',
      comment: '정말 맛있겠다!',
    },
    {
      id: 2,
      username: 'kelee98',
      comment: '장소가 어디인가용?',
    },
    {
      id: 3,
      username: 'xianeml',
      comment: '가고 싶어요!',
    },
    {
      id: 4,
      username: 'huiji0315',
      comment: '나도 가고 싶어요!',
    },
  ];

  useEffect(() => {
    setUser({
      displayName: UserStore.userinfo.displayName,
      photoUrl: UserStore.userinfo.photoUrl,
      uid: UserStore.userinfo.uid,
    });
    getFeedDetail();
  }, []);

  async function getFeedDetail() {
    const feedRef = db.collection('feed').doc(feedUid);
    const feedDoc = await feedRef.get();
    const feedDetail = feedDoc.data();
    setFeed(feedDetail);
  }

  async function deleteFeed() {
    await db.collection('feed').doc(feedUid).delete();
    router.push('/feed');
  }

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const handleSendClick = () => {
    const comments = {
      id: comments.length + 1,
      username: user.displayName,
      comment: inputs.comment,
    };
    setComments([...comments, comment]);
    setInputs({
      comment: '',
    });
  };
  return (
    <Grid container>
      <Grid item xs={8}>
        <Paper className={classes.paper}>
          <DetailFeed feed={feed} deleteHandler={deleteFeed} />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <Grid container direction='column'>
            {comments.map((comment) => (
              <Grid item>
                <Comment key={comment.id} data={comment} />
              </Grid>
            ))}
          </Grid>
          <Grid container direction='row' alignItems='center' spacing={3}>
            <Grid item>
              <Avatar
                size={1}
                photoUrl={user.photoUrl}
                displayName={user.displayName}
              />
            </Grid>
            <Grid item>
              <Grid container direction='column' justify='flex-start'>
                <Grid item>
                  <Typography
                    variant='body1'
                    component='h4'
                    display='block'
                    className={classes.commentItem}
                  >
                    {user.displayName}
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid container direction='row' spacing={2}>
                    <Grid item>
                      <TextField
                        name='comment'
                        placeholder='댓글을 입력해주세요...'
                        onChange={handleTextChange}
                        value={inputs.comment}
                      />
                    </Grid>
                    <Grid item>
                      <IconButton aria-label='send' onClick={handleSendClick}>
                        <SendIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
});

export default detail;
