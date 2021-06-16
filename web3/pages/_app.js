import React from 'react';
import '../styles/globals.css';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import Header from '../components/layout/Header';
import firebase from 'firebase';
import db from '../firestores/db';
import UserStore from '../firestores/UserStore';
function checkSession() {}
export default function MyApp(props) {
  const { Component, pageProps } = props;
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  var unsubscribeFromAuth = null;
  React.useEffect(() => {
    unsubscribeFromAuth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection('user')
          .get()
          .then((answer) => {
            answer.forEach((element) => {
              if (element.data().uid == user.uid) {
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
            alert('error' + error.message);
            console.log(error);
          });
      }
    });
    return () => {
      unsubscribeFromAuth;
    };
  });

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <div style={{ marginTop: '65px' }}>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
