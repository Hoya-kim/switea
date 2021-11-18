import axios from 'axios';
import Swal from 'sweetalert2';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import spinner from './components/spinner';
import {
  inputStatus,
  isAbleToSignup,
  isSamePassword,
} from './utils/formValidation';

// firebase setting
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

const $signupEmail = document.querySelector('#signupEmail');
const $signUpSubmit = document.querySelector('.signup-submit');
const $checkEmailDuplication = document.querySelector(
  '.check-email-duplication',
);
const $signupProfileImage = document.querySelector('#signupProfileImage');
const $confirmPassword = document.querySelector('#signupConfirmPassword');
const $form = document.querySelector('form');
const allInputOfForm = document.querySelectorAll('.required');

const getFormInfo = () => {
  const formInfo = {};
  allInputOfForm.forEach($input => {
    formInfo[$input.name] = $input.value;
  });
  return formInfo;
};

// input 유효성 검사
const checkValidation = $target => {
  const [$iconSuccess, $iconError] =
    $target.parentNode.querySelectorAll('.icon');
  const $errorMessage = $target.parentNode.querySelector('.error');
  const inputType = inputStatus[$target.name];

  inputType.status =
    $target.name !== 'confirmPassword'
      ? inputType.RegExp.test($target.value)
      : isSamePassword($target.value);

  $iconSuccess.classList.toggle('hidden', !inputType.status);
  $iconError.classList.toggle('hidden', inputType.status);
  $errorMessage.textContent = inputType.status ? '' : inputType.errorMessage;
};

// firebase storage image upload
const uploadImage = () => {
  const ref = firebase.storage().ref();
  const file = $signupProfileImage.files[0];

  // firebase storage에 업로드 될 파일명 설정
  const name = `${new Date()
    .toISOString()
    .substring(0, 10)
    .replace(/-/g, '')}-${file.name}`;

  const metadata = {
    contentType: file.type,
  };

  return ref.child(name).put(file, metadata);
};

// email 중복 검사 함수 => 리팩토링해보기
const checkEmailDuplication = async email =>
  Boolean(
    await firebase
      .database()
      .ref()
      .child('users')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then(snapshot => snapshot.val()),
  );

$signupProfileImage.onclick = e => {
  e.target.value = null;
};

// 프로필 이미지 파일 선택
$signupProfileImage.onchange = e => {
  if (!e.target.matches('input')) return;

  const reader = new FileReader();

  reader.onload = () => {
    document.querySelector('.profile-image__view').src = reader.result;
    inputStatus.profileImage.status = true;
    $signUpSubmit.disabled = !isAbleToSignup(allInputOfForm);
  };

  reader.readAsDataURL(e.target.files[0]);
};

$form.onsubmit = e => e.preventDefault();

$form.onkeydown = e => {
  if (e.key !== 'Enter' || e.target === $signupEmail) return;
  e.preventDefault();
};

$form.oninput = e => {
  e.preventDefault();
  if (e.target.name === 'profileImage') return;
  checkValidation(e.target);

  // 비밀번호 확인창이 입력된 상태에서 비밀번호 재입력시 비밀번호 확인 input 초기화
  if (e.target.name === 'password' && $confirmPassword.value !== '') {
    $confirmPassword.value = '';
    $confirmPassword.parentNode.querySelector('.error').textContent = '';

    $confirmPassword.parentNode.querySelectorAll('.icon').forEach($icon => {
      $icon.classList.add('hidden');
    });
  }

  $signUpSubmit.disabled = !isAbleToSignup(allInputOfForm);
};

$signupEmail.oninput = e => {
  e.target.parentNode.querySelector('.error').classList.remove('pass');
  checkValidation(e.target);
  $checkEmailDuplication.disabled = !inputStatus.email.status;
};

// 이메일 중복확인 버튼 클릭 시
$checkEmailDuplication.onclick = async e => {
  e.preventDefault();
  const result = await checkEmailDuplication($signupEmail.value);

  e.target.parentNode.querySelector('.error').textContent = result
    ? '중복된 이메일입니다. 다른 이메일을 사용해 주세요.'
    : '사용 가능한 이메일입니다. 가입을 진행해 주세요.';

  if (!result) {
    e.target.parentNode.querySelector('.error').classList.add('pass');
    inputStatus.email.duplication = true;
    $signUpSubmit.disabled = !isAbleToSignup(allInputOfForm);
  }
};

// 회원가입 버튼 클릭 시
$signUpSubmit.onclick = async e => {
  e.preventDefault();

  const { email, password, userName, phoneNum, nickname } = getFormInfo();

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // 프로필 이미지 firebase storage에 저장
    const snapshot = await uploadImage();
    const profileImage = await snapshot.ref.getDownloadURL();

    await axios.put(
      `https://switea-19c19-default-rtdb.firebaseio.com/users/${auth.currentUser.uid}.json`,
      {
        email,
        userName,
        phoneNum,
        nickname,
        profileImage,
      },
    );

    document.querySelector('form').reset(); // 폼 초기화
    auth.signOut(); // 회원가입 후 무조건 유저가 1회는 로그인을 직접 해야할 경우

    Swal.fire({
      title: '회원가입 성공',
      text: '성공적으로 회원가입 되었습니다. 로그인 페이지로 이동합니다.',
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: '확인',
    }).then(() => {
      window.location = '/signin.html';
    });
  } catch (error) {
    console.log(error);
    const errorCode = error.code;
    switch (errorCode) {
      case 'auth/email-already-in-use':
        Swal.fire({
          title: '회원가입 실패',
          text: '중복된 아이디 입니다.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: '확인',
        });
        break;
      default:
        Swal.fire({
          title: '회원가입 실패',
          text: '회원가입이 정상적으로 처리되지 않았습니다. 다시 시도해주세요.',
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: '확인',
        });
        break;
    }
  }
};

document.querySelector('.back').onclick = () => {
  window.history.back();
};

window.addEventListener(
  'DOMContentLoaded',
  setTimeout(spinner.removeOnView, 500),
);
