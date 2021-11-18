import Swal from 'sweetalert2';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get } from 'firebase/database';
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

const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());

const $tags = document.querySelector('.tags');

let recruitData;

const getUrlParams = () => {
  const params = {};
  window.location.search.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    (str, key, value) => {
      params[key] = value;
    },
  );
  return params;
};

const param = getUrlParams();
const { id } = param;

const $tagsFragment = document.createDocumentFragment();
const setTag = (content, ...tagName) => {
  const $tag = document.createElement('li');
  $tag.className = tagName.join(' ');
  $tag.textContent = `#${content}`;
  $tagsFragment.appendChild($tag);
};

const render = () => {
  const {
    title,
    type,
    tags,
    location: { placeName },
    minCapacity,
    maxCapacity,
    contact,
  } = recruitData;

  let { content, startDate, endDate } = recruitData;
  content = content.replace(/(?:\r\n|\r|\n)/g, '<br />');
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  setTag(placeName, 'tag', 'location');
  tags.forEach($el => setTag($el, 'tag'));
  $tags.appendChild($tagsFragment);

  document.querySelector('.view__title').textContent = title;
  document.querySelector('.view__type').textContent =
    type === 'regular' ? '정기스터디' : '일시스터디';

  document.querySelector('.view__date').textContent =
    +startDate === +endDate
      ? `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()}`
      : `${startDate.getFullYear()}.${startDate.getMonth()}.${startDate.getDate()} ~ ${endDate.getFullYear()}.${endDate.getMonth()}.${endDate.getDate()}`;

  document.querySelector('.view__capacity').textContent =
    minCapacity !== maxCapacity
      ? `${minCapacity}명 - ${maxCapacity}명`
      : `${minCapacity}명`;

  document.querySelector('.view__contact').textContent = contact;
  document.querySelector('.view__contents').innerHTML = content;
};

const getRecruit = async () => {
  try {
    const snapshot = await get(child(dbRef, `studies/${id}`));
    if (snapshot.exists()) {
      recruitData = snapshot.val();
      render();
      return;
    }

    Swal.fire({
      text: '해당 게시글을 찾을 수 없습니다.',
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: '확인',
    }).then(() => {
      window.location.href = './list.html';
    });
  } catch (error) {
    Swal.fire({
      title: '에러 발생',
      text: error,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: '확인',
    });
  }
};

document.querySelector('.back').onclick = () => {
  window.history.back();
};

window.addEventListener('DOMContentLoaded', () => {
  getRecruit();
  setTimeout(spinner.removeOnView, 1000);
});
