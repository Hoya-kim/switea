import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';
import { getDatabase, ref, get, child } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import spinner from './components/spinner';

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
const $logout = document.querySelector('.logout');

// TODO : Spinner 추가
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
        '.info-container__img-photo',
      ).style.backgroundImage = `url(${profileImage})`;

      document.querySelector(
        '.info-container__nickname',
      ).textContent = `${nickname}님`;

      setTimeout(spinner.removeOnView, 500);
    } else {
      Swal.fire({
        title: '로그인',
        html: `로그인이 필요합니다. <br>로그인 페이지로 이동합니다.`,
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: '확인',
      }).then(() => {
        window.location = '/signin.html';
      });
    }
  }),
);

// 로그아웃
$logout.onclick = () => {
  auth
    .signOut()
    .then(
      Swal.fire({
        title: '로그아웃',
        text: '로그아웃 되었습니다.',
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: '확인',
      }).then(() => {
        window.location = '/index.html';
      }),
    )
    .catch(() => {
      Swal.fire({
        title: '로그아웃 실패',
        html: `로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.`,
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: '확인',
      });
    });
};
