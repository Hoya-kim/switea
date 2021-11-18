import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database';
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

firebase.initializeApp(firebaseConfig);
const auth = getAuth();
const $articleCount = document.querySelector('.article-count');
let profileImage = '';

const getMyArticle = uid =>
  firebase
    .database()
    .ref()
    .child('studies')
    .orderByChild('creator')
    .equalTo(uid)
    .once('value')
    .then(snapshot => snapshot.val());

// 내가 쓴 모집글 render
const renderStudyList = studylist => {
  const $studyList = document.querySelector('.study-list');
  let studyListHTML = '';

  $articleCount.textContent = `내가 쓴 모집글 ${studylist.length}개`;

  studylist.forEach(studyData => {
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
          <p class="study-list__profile-image" style="background-image: url(${profileImage})"></p>
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

window.addEventListener(
  'DOMContentLoaded',
  onAuthStateChanged(auth, async user => {
    const { uid } = user;
    const dbRef = ref(getDatabase());
    profileImage = (await get(child(dbRef, `users/${uid}`))).val().profileImage;
    const studies = await getMyArticle(uid);
    document
      .querySelector('.myarticle-container')
      .classList.toggle('none', !studies);

    // 작성한 모집글이 없는 경우
    !studies
      ? ($articleCount.innerHTML = `작성한 모집글이 없습니다. <br>첫 번째 모집글을 작성해보세요🙂`)
      : renderStudyList(Object.values(studies));
    setTimeout(spinner.removeOnView, 500);
  }),
);
