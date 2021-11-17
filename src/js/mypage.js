import firebase from 'firebase/compat/app';
import { getDatabase, ref, child, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBO-Gg2r1Q58sjCfIDBvT_vjZkjwItkVik',
  authDomain: 'switea-19c19.firebaseapp.com',
  databaseURL: 'https://switea-19c19-default-rtdb.firebaseio.com',
  projectId: 'switea-19c19',
  storageBucket: 'switea-19c19.appspot.com',
  messagingSenderId: '182506057612',
  appId: '1:182506057612:web:27854724d6fe0d775a70a9',
  measurementId: 'G-XN3HTBG4LC',
};

firebase.initializeApp(firebaseConfig);
const auth = getAuth();

window.addEventListener(
  'DOMContentLoaded',
  onAuthStateChanged(auth, async user => {
    if (user) {
      const { uid } = user;
      const dbRef = ref(getDatabase());
      const { nickname, profileImage } = (
        await get(child(dbRef, `users/${uid}`))
      ).val();

      document.querySelector(
        '.info-container__nickname',
      ).textContent = `${nickname}님`;
      document.querySelector('.info-container__img-photo').src = profileImage;
    } else {
      alert('로그인이 필요합니다.');
      window.location.href = '/signin.html';
    }
  }),
);
