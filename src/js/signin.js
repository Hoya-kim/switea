import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { inputStatus, isAbleToSubmit } from './utils/formValidation';

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
const $signinSubmit = document.querySelector('.signin-submit');
const allInputOfForm = document.querySelectorAll('input');

const getFormInfo = () => {
  const formInfo = {};
  allInputOfForm.forEach($input => {
    formInfo[$input.name] = $input.value;
  });
  return formInfo;
};

const checkValidation = $target => {
  const $errorMessage = $target.parentNode.querySelector('.error');
  const inputType = inputStatus[$target.name];

  inputType.status = inputType.RegExp.test($target.value);
  $errorMessage.textContent = inputType.status ? '' : inputType.errorMessage;
};

document.querySelector('form').oninput = e => {
  checkValidation(e.target);

  $signinSubmit.disabled = !isAbleToSubmit(allInputOfForm);
};

// 로그인 버튼 클릭 시
$signinSubmit.onclick = async e => {
  e.preventDefault();
  const { email, password } = getFormInfo();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    Swal.fire({
      title: '로그인 성공',
      text: '로그인되었습니다!',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: '확인',
    }).then(() => {
      window.location = '/mypage.html';
    });
  } catch (error) {
    Swal.fire({
      title: '로그인 실패',
      text: '로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.',
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: '확인',
    });
  }
};
