import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const $filterToggleButton = document.querySelector('.filter__toggle-button');
const $modalContainer = document.querySelector('.filter__modal-container');
const $modalCloseButton = document.querySelector('.filter__modal-close');

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
const database = getDatabase(app);

let studyListData = {};

const renderStudyList = () => {
  const $studyLists = document.querySelector('.study-lists');
  studyListData.forEach(el => {
    const startDate = new Date(el.startDate);
    const endDate = new Date(el.endDate);

    const locationTag = el.location
      ? `<li class="tag location">#${el.location.placeName}</li>`
      : '';

    const tagsHTML = el.tags
      ? el.tags.map(tag => `<li class="tag">#${tag}</li>`).join('')
      : '';

    $studyLists.innerHTML += `
    <li class="study-lists__card">
      <a href="#">
        <div class="study-lists__profile-image"></div>
        <div class="study-lists__contents-container">
          <p class="study-lists__subject">${el.content}</p>
          <span class="study-lists__name">${el.nickName}</span>
          <span class="study-lists__date">${startDate.getMonth()}월 ${startDate.getDate()}일 - ${endDate.getMonth()}월 ${endDate.getDate()}일</span>
          <ul class="study-lists__tags tags">
          ${locationTag}
            ${tagsHTML}
          </ul>
        </div>
      </a>
    </li>`;
  });
};

// 데이터 읽기
const studyList = ref(database, 'studies/');

// 데이터 업데이트될 때 이벤트 발생
onValue(studyList, snapshot => {
  studyListData = Object.values(snapshot.val());
  renderStudyList();
});

const toggleFilterActivation = () => {
  const isToggleBtnActive = $filterToggleButton.classList.contains('active');

  $filterToggleButton.classList.toggle('active');
  $filterToggleButton.innerHTML = isToggleBtnActive ? '필터 열기' : '필터 닫기';
  $modalContainer.style.display = isToggleBtnActive ? 'none' : 'block';
};

[$filterToggleButton, $modalContainer, $modalCloseButton].forEach($el => {
  $el.onclick = e => {
    if (e.target !== $el) return;
    toggleFilterActivation();
  };
});
