import React, { useEffect } from 'react';
import UserStore from '../firestores/UserStore';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';

const index = observer(({ index }) => {
  const router = useRouter();

  useEffect(() => {
    if (!UserStore.userinfo) {
      router.push('/login');
    } else {
      router.push('/feed');
    }
  }, []);

  return <div></div>;
});

export default index;
