import React, { useState, useRef, useEffect } from 'react';
import Avatar from './common/Avatar';
import {
  CardHeader,
  CardMedia,
  CardContent,
  Card,
  CardActions,
  IconButton,
  Typography,
  makeStyles,
  Tooltip,
  Grow,
  ClickAwayListener,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useRouter } from 'next/router';
import db from '../firestores/db';

const useStyles = makeStyles((theme) => ({
  feed: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyItems: 'center',
  },
  header: {
    margin: '1rem 0',
    width: '600px',
    height: '55px',
    textAlign: 'left',
  },
  media: {
    maxHeight: '600px',
    width: '100%',
    overflow: 'auto',
  },
  mediaImg: {
    height: 'auto',
    width: '600px',
    display: 'block',
  },
  content: {
    textAlign: 'left',
  },
  deleteText: {
    color: 'red',
  },
}));

export default function DetailFeed({ feed, deleteHandler }) {
  const classes = useStyles();
  const router = useRouter();
  const { feedUid } = router.query;

  const [liked, setLiked] = useState({
    status: false,
    num: feed.like,
  });
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  var t = new Date(1970, 0, 1);
  t.setSeconds(feed.create_at.seconds);

  const createAT =
    t.getDate() + '/' + (t.getMonth() + 1) + '/' + t.getFullYear();

  const openSettingMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const closeSettingMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleUpdate = () => {
    router.push({
      pathname: '/edit',
      query: { feedUid },
    });
  };

  const handleDelete = () => {
    deleteHandler();
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleHeartClick = () => {
    const likeNum = liked.status ? (liked.num -= 1) : (liked.num += 1);
    setLiked({
      status: !liked.status,
      num: likeNum,
    });
    db.collection('feed')
      .doc(feed.uid)
      .update({
        like: likeNum,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.feed}>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={closeSettingMenu}>
                <MenuList
                  autoFocusItem={open}
                  id='menu-list-grow'
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleUpdate}>수정</MenuItem>
                  <MenuItem
                    className={classes.deleteText}
                    onClick={handleDelete}
                  >
                    삭제
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          avatar={
            <Avatar
              size={1}
              photoUrl={feed.author.photoUrl}
              displayName={feed.author.displayName}
            />
          }
          action={
            <IconButton
              aria-label='settings'
              aria-haspopup='true'
              onClick={openSettingMenu}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup='true'
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={feed.author.displayName}
          subheader={createAT + ' ' + feed.location}
        />
        <CardMedia className={classes.media}>
          <img
            src={feed.photoUrl}
            alt={feed.content}
            className={classes.mediaImg}
          />
        </CardMedia>
        <CardContent className={classes.content}>
          <Typography variant='body1' component='p'>
            {feed.content}
          </Typography>
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
          <Tooltip title={feed.tag || '태그 없음'} placement='top' arrow>
            <IconButton aria-label='tag' className>
              <LocalOfferIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </div>
  );
}
