import { initializeApp } from 'firebase/app';
import axios from 'axios';
import flatpickr from 'flatpickr';

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

const $form = document.querySelector('.recruit-container form');
const $tags = document.querySelector('.recruit-container .tags');
const $addTags = document.querySelector('.recruit-container .add-tags');
const $location = document.getElementById('location');
const $locationModal = document.querySelector('.location-modal__wrap');
const $datepicker = document.querySelector('.datepicker');
const $capacity = document.querySelector('.capacity');

let tags = [];

flatpickr($datepicker, {
  mode: 'range',
  dateFormat: 'Y.m.d',
  minDate: 'today',
  locale: {
    weekdays: {
      shorthand: ['일', '월', '화', '수', '목', '금', '토'],
      longhand: [
        '일요일',
        '월요일',
        '화요일',
        '수요일',
        '목요일',
        '금요일',
        '토요일',
      ],
    },

    months: {
      shorthand: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      longhand: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
    },

    ordinal: () => '일',

    rangeSeparator: ' ~ ',
  },
});

const addTag = content => {
  const $tag = document.createElement('li');
  const $tagDelete = document.createElement('button');
  $tag.className = 'tag';
  $tag.textContent = `#${content}`;
  $tagDelete.className = 'tag-delete';
  $tagDelete.textContent = 'X';
  $tag.appendChild($tagDelete);
  $tags.appendChild($tag);

  tags = [...tags, content];
};

const recruitRequest = async e => {
  const {
    title: { value: title },
    type: { value: type },
    location: { value: location },
    date: { value: date },
    minCapacity: { value: minCapacity },
    maxCapacity: { value: maxCapacity },
    contact: { value: contact },
    content: { value: content },
  } = e.target;

  const startDate = date.split('~')[0];
  const endDate = date.split('~').length > 1 ? date.split('~')[1] : startDate;

  try {
    const { status } = await axios.post(
      `https://switea-19c19-default-rtdb.firebaseio.com/studies.json`,
      {
        creator: 'user ID',
        title,
        type,
        tags,
        location,
        createDate: Date.now(),
        startDate,
        endDate,
        minCapacity,
        maxCapacity,
        contact,
        content,
        isActive: true,
      },
    );

    if (status === 200) {
      alert('등록 성공');
      window.location.href = './list.html';
    }
  } catch (e) {
    console.log(e);
  }
};

$addTags.onkeydown = e => {
  if (e.key !== 'Enter') return;
  const content = e.target.value.trim();

  if (content) {
    tags.length < 10
      ? addTag(content)
      : alert('태그는 10개까지 등록 가능합니다.');
  }

  e.target.value = '';
};

$tags.onclick = e => {
  if (!e.target.classList.contains('tag-delete')) return;

  const allTag = document.querySelectorAll('.tags li');
  tags.splice([...allTag].indexOf(e.target.closest('li')), 1);
  e.target.closest('li').remove();
};

$location.onkeydown = e => {
  if (e.key !== 'Enter') return;
  $locationModal.style.display = 'block';
};

$locationModal.onclick = e => {
  if (
    !e.target.classList.contains('location-modal--close') &&
    !e.target.classList.contains('location-modal__bg')
  )
    return;
  $locationModal.style.display = 'none';
  $location.value = '';
};

$capacity.oninput = e => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
};

$form.onkeydown = e => {
  if (e.key !== 'Enter' || e.target.name === 'content') return;
  e.preventDefault();
};

$form.onsubmit = e => {
  e.preventDefault();

  let valueList = document.querySelectorAll('form input:not(.add-tags)');
  valueList = [...valueList, document.querySelector('form textarea')];

  if (!valueList.every($el => $el.value !== '')) {
    alert('모든 항목을 입력해주세요');
    return;
  }

  recruitRequest(e);
};
