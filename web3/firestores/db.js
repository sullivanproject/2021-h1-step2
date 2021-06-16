// firebase를 초기 세팅하는 코드를 넣은 파일
import firebase from "./firebase";

const db = firebase.firestore();
const settings = {
  timesstampsInSnapshots: true,
};
db.settings(settings);

export default db;
