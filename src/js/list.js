import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import bindFlatpicker from './components/datepicker';
import { getTags, addTag, removeTag } from './utils/tag';

const $filterToggleButton = document.querySelector('.filter__toggle-button');
const $modalContainer = document.querySelector('.filter__modal-container');
const $modalCloseButton = document.querySelector('.filter__modal-close');
const $filterForm = document.querySelector('.filter__modal > form');
const $addTags = document.querySelector('.add-tags');
const $tags = document.querySelector('.tags');
const $datepicker = document.querySelector('.datepicker');

const TAG_CONSTANTS = {
  MAX_LENGTH: 3,
  ALERT_MESSAGE: '태그는 3개까지 검색 가능합니다.',
};

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

bindFlatpicker($datepicker);

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const studyList = ref(database, 'studies/');

let totalStudyListData = {};

const renderStudyList = studyListData => {
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
          <span class="study-list__name">${studyData.nickname}</span>
          <span class="study-list__date">${
            startDate.getMonth() + 1
          }월 ${startDate.getDate()}일 - ${
      endDate.getMonth() + 1
    }월 ${endDate.getDate()}일</span>
          <ul class="study-list__tags tags">
            ${locationTagHTML}${tagsHTML}
          </ul>
        </div>
      </a>
    </li>`;
  });
  $studyList.innerHTML = studyListHTML;
};

const toggleFilterActivation = () => {
  const isToggleBtnActive = $filterToggleButton.classList.contains('active');

  $filterToggleButton.classList.toggle('active');
  $filterToggleButton.innerHTML = isToggleBtnActive ? '필터 열기' : '필터 닫기';
  $modalContainer.style.display = isToggleBtnActive ? 'none' : 'block';
};

const filterStudies = conditions => {
  const { filterType, filterStartDate, filterEndDate, filterTags } = conditions;
  return totalStudyListData.filter(studyData => {
    const { type, startDate, endDate, tags } = studyData;
    const isTypeSatisfiedCondition = filterType ? type === filterType : true;
    const isDateSatisfiedCondition =
      filterStartDate || filterEndDate
        ? (new Date(filterStartDate) <= new Date(startDate) &&
            new Date(startDate) <= new Date(filterEndDate)) ||
          (new Date(filterStartDate) <= new Date(endDate) &&
            new Date(endDate) <= new Date(filterEndDate))
        : true;
    const isTagsSatisfiedCondition = filterTags.length
      ? filterTags.some(tag => tags.includes(tag))
      : true;

    return (
      isTypeSatisfiedCondition &&
      isDateSatisfiedCondition &&
      isTagsSatisfiedCondition
    );
  });
};

[$filterToggleButton, $modalContainer, $modalCloseButton].forEach($el => {
  $el.onclick = e => {
    if (e.target !== $el) return;
    toggleFilterActivation();
  };
});

// 데이터 업데이트될 때 이벤트 발생
onValue(studyList, snapshot => {
  totalStudyListData = Object.values(snapshot.val());
  renderStudyList(totalStudyListData);
});

// 필터 조건 입력받기
$filterForm.onsubmit = e => {
  if (e.target !== $filterForm) return;
  e.preventDefault();

  const filterConditions = {
    filterType: [...$filterForm.querySelectorAll('input[type=radio]')]
      .find($input => $input.checked)
      .getAttribute('value'),
    filterTags: getTags(),
    filterStartDate: e.target.date.value
      ? new Date(e.target.date.value.split(' ~ ')[0])
      : null,
    filterEndDate: e.target.date.value
      ? new Date(e.target.date.value.split(' ~ ')[1])
      : null,
  };

  toggleFilterActivation();
  renderStudyList(filterStudies(filterConditions));
};

$filterForm.onkeydown = e => {
  // TODO: ESC 누르면 모달창 닫기?
  // if (e.key === 'Escape') toggleFilterActivation();
  if (e.key !== 'Enter' || e.target.name === 'content') return;
  e.preventDefault();
};

// TODO: 요소 변수명이 동사로 시작하는 것이 어색하지 않은지 고민해 보기
$addTags.onkeydown = e => addTag(e, TAG_CONSTANTS, $tags);

$tags.onclick = e => removeTag(e);
