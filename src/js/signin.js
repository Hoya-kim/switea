// import { initializeApp } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as Joi from 'joi';

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

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const formInfo = {};
const errorMessage = {
  email: '이메일 형식에 맞게 입력해 주세요.',
  password: '비밀번호를 입력해주세요.',
};

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().min(1),
});

document.querySelector('form').oninput = e => {
  const $errorMessage = e.target.parentNode.lastElementChild;
  formInfo[e.target.name] = e.target.value;

  $errorMessage.textContent = schema.validate(formInfo).error
    ? errorMessage[e.target.name]
    : '';

  document.querySelector('.signin-submit').disabled =
    schema.validate(formInfo).error;
};

document.querySelector('.signin-submit').onclick = async e => {
  e.preventDefault();
  const { email, password } = formInfo;

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    alert('로그인되었습니다!');
  } catch (e) {
    console.log(e.message);
  }
};

document.querySelector('.signup').onclick = () => {
  window.location.href = '/signup.html';
};
