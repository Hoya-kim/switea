import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import spinner from './components/spinner';
import getGeoLocation from './utils/geoLocation';

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
const studyList = ref(database, 'studies/');

let totalStudyListData = {};
// let profileImage = '';

const renderStudyList = studyListData => {
  const $studyList = document.querySelector('.study-list');
  let studyListHTML = '';

  studyListData.forEach(([studyId, study]) => {
    const {
      startDate,
      endDate,
      profileImage,
      location,
      tags,
      title,
      nickname,
    } = study;

    const locationTagHTML = location
      ? `<li class="tag location">#${location.placeName}</li>`
      : '';

    const tagsHTML = tags
      ? tags.map(tag => `<li class="tag">#${tag}</li>`).join('')
      : '';

    studyListHTML = `
    <li class="study-list__card">
      <a href="/view.html?id=${studyId}">
        <div class="study-list__profile-image"></div>
        <div class="study-list__contents-container">
          <p class="study-list__subject">${title}</p>
          <span class="study-list__name">${nickname}</span>
          <span class="study-list__date">${
            new Date(startDate).getMonth() + 1
          }월 ${new Date(startDate).getDate()}일 - ${
      new Date(endDate).getMonth() + 1
    }월 ${new Date(endDate).getDate()}일</span>
          <ul class="study-list__tags tags">
            ${locationTagHTML}${tagsHTML}
          </ul>
        </div>
      </a>
    </li>`;
  });

  $studyList.innerHTML = studyListHTML;

  $studyList.children[0].querySelector(
    '.study-list__profile-image',
  ).style.backgroundImage = `url(${profileImage})`;
};

// const sortByDistance = studyList => {

// }

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    spinner.removeOnView();

    const $welcome = document.createElement('div');
    $welcome.innerHTML = `
      <object type="image/svg+xml" data="./images/welcome_switea.svg">
        <img src="./images/welcome_switea.svg" alt="Switea"/>
      </object>`;
    const $main = document.querySelector('main');
    $main.insertBefore($welcome, $main.firstChild);
  }, 1000);
});

(async () => {
  const { latitude, longitude } = await getGeoLocation();

  console.log(await getGeoLocation());
  console.log(latitude, longitude);

  spinner.removeOnView();
})();

// 데이터 업데이트될 때 이벤트 발생
onValue(studyList, snapshot => {
  totalStudyListData = Object.entries(snapshot.val());
  renderStudyList(totalStudyListData);
  // spinner.removeOnView;
  // setTimeout(spinner.removeOnView, 500);
});
