import Swal from 'sweetalert2';
import { initializeApp } from 'firebase/app';
import axios from 'axios';
import { getDatabase, ref, child, get, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { searchByKeyword } from './utils/kakaoMap';
import bindFlatpicker from './components/datepicker';
import { getTags, addTag, removeTag } from './utils/tag';

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
const $datepicker = document.querySelector('.datepicker');
bindFlatpicker($datepicker);

const TAG_CONSTANTS = {
  MAX_LENGTH: 10,
  ALERT_MESSAGE: '태그는 10개까지 등록 가능합니다.',
};

const $form = document.querySelector('.recruit-container form');
const $addTags = document.querySelector('.recruit-container .add-tags');
const $tags = document.querySelector('.recruit-container .tags');
const $location = document.getElementById('location');
const $modalSearch = document.getElementById('modalSearch');
const $locationModal = document.querySelector('.location-modal__wrap');
const $locationModalList = document.querySelector(
  '.location-modal__search-list',
);
const $capacity = document.querySelector('.capacity');

let documents;
const location = {
  id: '',
  roadAddressName: '',
  addressName: '',
  placeName: '',
  x: '',
  y: '',
};

// function
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

  const addStudy = async user => {
    if (!user) {
      Swal.fire({
        text: '로그인이 필요한 페이지입니다.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: '확인',
      }).then(() => {
        window.location = './signin.html';
      });
    }

    const dbRef = ref(getDatabase());

    try {
      const { nickname, studies } = (
        await get(child(dbRef, `users/${user.uid}`))
      ).val();

      const result = await axios.post(
        `https://switea-19c19-default-rtdb.firebaseio.com/studies.json`,
        {
          creator: user.uid,
          nickname,
          title,
          type,
          tags: getTags(),
          location,
          createDate: Date.now(),
          startDate: Date.parse(startDate),
          endDate: Date.parse(endDate),
          minCapacity,
          maxCapacity,
          contact,
          content,
          isActive: true,
        },
      );

      const writeUserData = study => {
        const db = getDatabase();
        update(ref(db, `users/${user.uid}`), {
          studies: studies ? [...studies, study] : [study],
        });
      };

      writeUserData(result.data.name);

      if (result.status === 200) {
        Swal.fire({
          title: '등록 성공',
          text: '모집글이 정상적으로 등록되었습니다.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonText: '확인',
        }).then(() => {
          window.location = './list.html';
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  await onAuthStateChanged(auth, addStudy);
};

// 이벤트 핸들러
$addTags.onkeydown = e => {
  if (e.isComposing) return;
  addTag(e, TAG_CONSTANTS, $tags);
};

$tags.onclick = removeTag;

$location.onclick = e => {
  e.target.blur();

  $locationModal.style.display = 'block';
  document.body.classList.add('non-scroll');
  $modalSearch.focus();
};

$modalSearch.onkeydown = async e => {
  if (e.isComposing || e.key !== 'Enter') return;

  const result = await searchByKeyword(e.target.value);
  documents = result.documents;

  const $searchListFragment = document.createDocumentFragment();

  $locationModalList.innerHTML = '';
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
  $locationModalList.classList.add('border');
};

$locationModal.onclick = e => {
  if (
    e.target.classList.contains('location-modal--close') ||
    e.target.classList.contains('location-modal__bg')
  ) {
    $locationModal.style.display = 'none';
    $locationModalList.innerHTML = '';
    document.body.classList.remove('non-scroll');

    $modalSearch.value = '';
    $locationModalList.classList.remove('border');
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
    document.body.classList.remove('non-scroll');

    $modalSearch.value = '';
    $locationModalList.classList.remove('border');
  }
};

$capacity.oninput = e => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
};

$form.onkeydown = e => {
  if (e.isComposing || e.key !== 'Enter' || e.target.name === 'content') return;
  e.preventDefault();
};

$form.onsubmit = e => {
  e.preventDefault();

  let valueList = document.querySelectorAll('form input:not(.add-tags)');
  valueList = [...valueList, document.querySelector('form textarea')];

  if (!valueList.every($el => $el.value !== '')) {
    Swal.fire({
      text: '모든 항목을 입력해주세요.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: '확인',
    });
    return;
  }

  recruitRequest(e);
};
