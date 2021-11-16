import { initializeApp } from 'firebase/app';
import axios from 'axios';
import flatpickr from 'flatpickr';
import { searchByKeyword } from './utils/kakaoMap';

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
const $locationModalList = document.querySelector(
  '.location-modal__search-list',
);
const $datepicker = document.querySelector('.datepicker');
const $capacity = document.querySelector('.capacity');

let tags = [];
let documents;
const location = {
  id: '',
  roadAddressName: '',
  addressName: '',
  placeName: '',
  x: '',
  y: '',
};

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
        nickName: '닉네임',
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
      // window.location.href = './list.html';
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

$location.onkeydown = async e => {
  if (e.key !== 'Enter') return;
  e.target.blur();

  const result = await searchByKeyword(e.target.value);
  documents = result.documents;

  const $searchListFragment = document.createDocumentFragment();

  $locationModal.style.display = 'block';
  document.body.classList.add('active');

  if (documents.length > 0) {
    documents.forEach(($el, index) => {
      const $searchListItem = document.createElement('li');
      $searchListItem.dataset.index = index;
      $searchListItem.className = 'location-modal__search-list--item';
      $searchListItem.innerHTML = `
        <p class="place-name">${$el.place_name}</p>
        <p class="road-address-name">${
          $el.road_address_name || $el.address_name
        }</p>
      `;
      $searchListFragment.append($searchListItem);
    });
  } else {
    const $searchListItem = document.createElement('li');
    $searchListItem.className = 'no-result';
    $searchListItem.textContent = '검색 결과가 없습니다.';
    $searchListFragment.append($searchListItem);
  }

  $locationModalList.append($searchListFragment);
};

$locationModal.onclick = e => {
  if (
    e.target.classList.contains('location-modal--close') ||
    e.target.classList.contains('location-modal__bg')
  ) {
    $location.value = '';
    $locationModal.style.display = 'none';
    $locationModalList.innerHTML = '';
    document.body.classList.remove('active');
  }

  if (e.target.matches('.location-modal__search-list *')) {
    const itemIndex = e.target.closest('li').dataset.index;

    location.id = documents[itemIndex].id;
    location.addressName = documents[itemIndex].address_name;
    location.roadAddressName = documents[itemIndex].road_address_name;
    location.placeName = documents[itemIndex].place_name;
    location.x = documents[itemIndex].x;
    location.y = documents[itemIndex].y;

    $location.value = documents[itemIndex].place_name;
    $locationModal.style.display = 'none';
    $locationModalList.innerHTML = '';
    document.body.classList.remove('active');
  }
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
