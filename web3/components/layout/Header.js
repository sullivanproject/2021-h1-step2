import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react';
import firebase from 'firebase';
import UserStores from '../../firestores/UserStore';
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const useStyles = makeStyles(() => ({
  fix: {
    position: 'fixed',
    top: 0,
  },
  grow: {
    flexGrow: 1,
  },
  logoutText: {
    color: 'red',
  },
}));

const Header = observer(({ Header }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleNotificationMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        UserStores.clearPersistedData();
        window.location.href = '/';
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const menuId = 'primary-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>알림 1</MenuItem>
      <MenuItem onClick={handleMenuClose}>알림 2</MenuItem>
      <MenuItem onClick={handleMenuClose}>알림 3</MenuItem>
      <MenuItem className={classes.logoutText} onClick={logout}>
        로그아웃
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.grow}>
      <AppBar className={classes.fix}>
        <Toolbar>
          <Link href='/'>
            <Typography variant='h6' noWrap>
              Sullivan-SNS
            </Typography>
          </Link>
          <div className={classes.grow} />
          <div>
            <Link href='/edit'>
              <IconButton aria-label='add feed' color='inherit'>
                <AddCircleOutlineIcon />
              </IconButton>
            </Link>
            <Link href='/myfeed'>
              <IconButton
                edge='end'
                aria-label='account of user'
                color='inherit'
              >
                <AccountCircle />
                {UserStores.userinfo != null && (
                  <Typography variant='h6' noWrap>
                    {UserStores.userinfo.displayName} 님 반갑습니다
                  </Typography>
                )}
              </IconButton>
            </Link>
            <IconButton
              aria-label='show new notifications'
              color='inherit'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={3} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
});
export default Header;
