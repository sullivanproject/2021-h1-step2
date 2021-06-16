import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Avatar from './common/Avatar';
import Comment from './Comment';
import db from '../firestores/db';
import {
  Paper,
  TextField,
  Grid,
  CardHeader,
  CardMedia,
  CardContent,
  Card,
  CardActions,
  Collapse,
  IconButton,
  Typography,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import UserStore from '../firestores/UserStore';

const useStyles = makeStyles(() => ({
  feed: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  root: {
    marginTop: '55px',
    width: '800px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  comment: {
    width: '600px',
    height: '75px',
  },
  commentItem: {
    marginTop: '10px',
  },
  commentSend: {
    display: 'flex',
    flexDirection: 'row',
  },
  link: {
    cursor: 'pointer',
  },
}));

export default function Feed({ feed, comments, setComments }) {
  const {
    content,
    like = 0,
    photoUrl,
    author,
    tag,
    create_at,
    uid,
    location,
  } = feed;

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState({
    status: false,
    num: like,
  });
  const [inputs, setInputs] = useState({
    comment: '',
  });
  const [likeFeeds, setLikeFeeds] = useState([]);

  useEffect(() => {
    let checkFeed = [];
    if (!UserStore.userinfo && !UserStore.userinfo.likeFeeds) {
      Router.push('/login');
    }
    if (UserStore.userinfo.likeFeeds !== '') {
      setLikeFeeds(UserStore.userinfo.likeFeeds);
      checkFeed = [...UserStore.userinfo.likeFeeds];
    }
    for (const feedId of checkFeed) {
      if (uid === feedId) {
        setLiked({
          ...liked,
          status: true,
        });
        break;
      }
    }
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleHeartClick = () => {
    const likeNum = liked.status ? (liked.num -= 1) : (liked.num += 1);
    let updateFeedLike = [];
    if (liked.status) {
      updateFeedLike = likeFeeds.filter((feedId) => feedId !== uid);
    } else {
      updateFeedLike = [...likeFeeds, uid];
    }
    // 피드 - 좋아요 수 업데이트
    db.collection('feed')
      .doc(uid)
      .update({
        like: likeNum,
      })
      .catch((err) => {
        console.log(err);
      });
    // 사용자 - 좋아하는 피드 리스트 업데이트
    db.collection('user')
      .doc(UserStore.userinfo.uid)
      .update({ likeFeeds: updateFeedLike })
      .catch((err) => console.log(err));

    setLiked({
      status: !liked.status,
      num: likeNum,
    });
    setLikeFeeds(updateFeedLike);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSendClick = () => {
    const comment = {
      id: comments.length + 1,
      username: 'aeuna',
      comment: inputs.comment,
    };
    setComments([...comments, comment]);
    setInputs({
      comment: '',
    });
  };

  let t = new Date(1970, 0, 1);
  t.setSeconds(create_at);
  const createAT =
    t.getFullYear() + '/' + (t.getMonth() + 1) + '/' + t.getDate();

  return (
    <div className={classes.feed}>
      <Card className={classes.root}>
        <CardHeader
          avatar={<Avatar size={1} photoUrl={author.photoUrl} />}
          title={author.displayName}
          subheader={createAT + ' ' + location}
        />
        {photoUrl && <CardMedia className={classes.media} image={photoUrl} />}
        <CardContent>
          <Typography variant='body1' component='p'>
            {content.length < 180 ? content : content.slice(0, 180) + '...'}
          </Typography>
          <Link href='/feed/[feedUid]' as={'/feed/' + uid}>
            <Typography
              variant='body2'
              color='textSecondary'
              className={classes.link}
            >
              더보기
            </Typography>
          </Link>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label='add to favorites' onClick={handleHeartClick}>
            {liked.status ? (
              <FavoriteIcon color='secondary' />
            ) : (
              <FavoriteIcon />
            )}
          </IconButton>
          <Typography>
            {liked.num <= 0 || !liked.num ? 0 : liked.num}
          </Typography>
          <IconButton
            aria-label='comment'
            onClick={handleExpandClick}
            aria-expanded={expanded}
          >
            <ChatIcon />
          </IconButton>
          <Tooltip title={tag || '태그 없음'} placement='top' arrow>
            <IconButton aria-label='tag' className>
              <LocalOfferIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Paper style={{ padding: '20px 20px' }}>
              {comments.map((comment) => (
                <Comment key={comment.id} data={comment} />
              ))}
              <Grid container wrap='nowrap' spacing={2}>
                <Grid item>
                  <Avatar size={1} />
                </Grid>
                <Grid
                  className={classes.commentItem}
                  justifyContent='left'
                  item
                  xs
                  zeroMinWidth
                >
                  <h4 style={{ margin: 0, textAlign: 'left' }}>aeuna</h4>
                  <div className={classes.commentSend}>
                    <TextField
                      name='comment'
                      multiline
                      placeholder='댓글을 입력해주세요...'
                      rowsMax={3}
                      className={classes.comment}
                      onChange={handleTextChange}
                      value={inputs.comment}
                    />
                    <IconButton aria-label='send' onClick={handleSendClick}>
                      <SendIcon />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
