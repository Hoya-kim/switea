import axios from 'axios';
import Swal from 'sweetalert2';
import * as kakaoMap from './utils/kakaoMap';
import spinner from './components/spinner';

// DOMElements
const $mainArea = document.getElementById('map');
const $mapContainer = document.createElement('div');
const $searchInput = document.getElementById('searchInput');
const $locationButton = document.querySelector('.location-button');

// functions
/**
 * @description Render study info list about clicked marker, cluster
 * @param {Array<object>} studyList
 */
const renderMarkered = studyListData => {
  const $infoContainer = document.querySelector('.studyInfo-container');
  $infoContainer.scrollTo(0, 0);

  let studyListHTML = '';
  let profileImageUrls = [];

  studyListData.forEach(({ id, study }) => {
    const {
      startDate,
      endDate,
      profileImage,
      location,
      tags,
      title,
      nickname,
    } = study;

    profileImageUrls = [...profileImageUrls, profileImage];

    const locationTagHTML = location
      ? `<li class="tag location">#${location.placeName}</li>`
      : '';

    const tagsHTML = tags
      ? tags.map(tag => `<li class="tag">#${tag}</li>`).join('')
      : '';

    studyListHTML += `
    <li class="study-list__card">
      <a href="/view.html?id=${id}">
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

  $infoContainer.innerHTML = studyListHTML;

  profileImageUrls.forEach((url, idx) => {
    $infoContainer.children[idx].querySelector(
      '.study-list__profile-image',
    ).style.backgroundImage = `url(${url})`;
  });

  studyListData.length > 1
    ? $infoContainer.classList.add('multiple')
    : $infoContainer.classList.remove('multiple');
};

// Event Listeners
window.addEventListener('DOMContentLoaded', async () => {
  $mapContainer.classList.add('kakaoMap');
  $mainArea.appendChild($mapContainer);
  kakaoMap.initMapView($mapContainer);

  // 현재위치 설정
  kakaoMap.setGeoMarker();

  /** @todo get list of item, isActive === "true" */
  const { data } = await axios.get(
    `https://switea-19c19-default-rtdb.firebaseio.com/studies.json`,
  );
  kakaoMap.setMarkers(data, renderMarkered);

  setTimeout(spinner.removeOnView, 1000);
});

$searchInput.onkeydown = async e => {
  if (e.isComposing || e.key !== 'Enter') return;
  e.preventDefault();

  try {
    const { documents } = await kakaoMap.searchByAddress(e.target.value);

    if (!documents.length) {
      Swal.fire({
        title: '위치 검색 실패',
        html: `위치 검색에 실패하였습니다.<br>"${e.target.value}"에 해당하는 검색결과가 없습니다.<br>올바른 지역을 입력해 주세요.`,
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: '확인',
      });
      return;
    }
    kakaoMap.moveCenterByCoords(documents[0].y, documents[0].x);
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

$locationButton.onclick = () => {
  kakaoMap.moveGeoMarker();
};
