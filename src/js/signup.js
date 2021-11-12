import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import * as Joi from 'joi';

const $inputConfirmPassword = document.querySelector(
  'input[name = confirmPassword]',
);

const formInfo = {};

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

const errorMessage = {
  email: '이메일 형식에 맞게 입력해 주세요.',
  password: '숫자, 영문 대소문자를 조합하여 8-20자 이내로 입력해주세요.',
  confirmPassword: '비밀번호를 동일하게 입력해 주세요.',
  userName: '이름을 2-10자 이내로 입력해주세요.',
  nickname: '한글, 알파벳, 숫자를 2-15글자로 입력해 주세요.',
  phoneNum: '핸드폰 번호 형식을 확인해 주세요.',
};

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string()
    .pattern(/[a-zA-Z0-9]/)
    .min(8)
    .max(20),
  confirmPassword: Joi.string().equal(Joi.ref('password')),
  userName: Joi.string().min(2).max(10),
  nickname: Joi.string().min(2).max(15),
  phoneNum: Joi.string().pattern(
    new RegExp('01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}'),
  ),
});

document.querySelector('form').oninput = e => {
  const $errorMessage = e.target.parentNode.lastElementChild;
  formInfo[e.target.name] = e.target.value;
  const res = schema.validate(formInfo);

  $errorMessage.textContent = res.error ? errorMessage[e.target.name] : '';

  if (e.target.name === 'password') {
    if ($inputConfirmPassword.value !== '') {
      $inputConfirmPassword.value = '';
      $inputConfirmPassword.parentNode.lastChild.textContent = '';
    }
  }

  document.querySelector('.signup-submit').disabled = res.error;
};

document.querySelector('.signup-submit').onclick = async e => {
  e.preventDefault();

  const { userName, phoneNum, nickname } = formInfo;

  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      formInfo.email,
      formInfo.password,
    );

    await axios.put(
      `https://switea-19c19-default-rtdb.firebaseio.com/users/${auth.currentUser.uid}.json`,
      {
        userName,
        phoneNum,
        nickname,
      },
    );

    alert('성공적으로 회원가입 되었습니다!');
    window.location.href = '/signin.html';
  } catch (e) {
    console.log(e.message);
  }
};
