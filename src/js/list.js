import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

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

// 데이터 읽기
const studyList = ref(database, 'studies/');

let studyListData = {};

const renderStudyList = () => {
  const $studyList = document.querySelector('.study-list');
  let studyListHTML = '';

  studyListData.forEach(studyData => {
    const startDate = new Date(studyData.startDate);
    const endDate = new Date(studyData.endDate);

    const locationTagHTML = studyData.location
      ? `<li class="tag location">#${studyData.location.placeName}</li>`
      : '';

    const tagsHTML = studyData.tags
      ? studyData.tags.map(tag => `<li class="tag">#${tag}</li>`).join('')
      : '';

    studyListHTML += `
    <li class="study-list__card">
      <a href="#">
        <div class="study-list__profile-image"></div>
        <div class="study-list__contents-container">
          <p class="study-list__subject">${studyData.title}</p>
          <span class="study-list__name">${studyData.nickName}</span>
          <span class="study-list__date">${startDate.getMonth()}월 ${startDate.getDate()}일 - ${endDate.getMonth()}월 ${endDate.getDate()}일</span>
          <ul class="study-list__tags tags">
            ${locationTagHTML}${tagsHTML}
          </ul>
        </div>
      </a>
    </li>`;
  });
  $studyList.innerHTML = studyListHTML;
};

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
