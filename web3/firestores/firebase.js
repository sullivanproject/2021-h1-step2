import firebase from 'firebase';
import firebaseConfig from './firbaseconfig';

  // try: 초기화가 되어있으면 실행 
  // catch: 안되어 있으면 초기화 실행 하는 구문
try{
    firebase.app(); 
}
catch{
    firebase.initializeApp(firebaseConfig); 
}

  export default firebase;