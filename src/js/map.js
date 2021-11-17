import axios from 'axios';
import Swal from 'sweetalert2';
import * as kakaoMap from './utils/kakaoMap';

// DOMElements
const $mainArea = document.getElementById('map');
const $mapContainer = document.createElement('div');
const $searchInput = document.getElementById('searchInput');

$mapContainer.classList.add('kakaoMap');
$mainArea.appendChild($mapContainer);
kakaoMap.initMapView($mapContainer);

// 현재위치 설정
kakaoMap.setGeoMarker();

const renderMarkered = studyList => {
  const $infoContainer = document.querySelector('.studyInfo-container');
  $infoContainer.scrollTo(0, 0);

  let studyListHTML = '';
  studyList.forEach(({ id, study }) => {
    const startDate = new Date(study.startDate);
    const endDate = new Date(study.endDate);

    const locationTagHTML = study.location
      ? `<li class="tag location">#${study.location.placeName}</li>`
      : '';

    const tagsHTML = study.tags
      ? study.tags.map(tag => `<li class="tag">#${tag}</li>`).join('')
      : '';

    studyListHTML += `
    <li class="study-list__card">
      <a href="/view.html?id=${id}">
        <div class="study-list__profile-image"></div>
        <div class="study-list__contents-container">
          <p class="study-list__subject">${study.title}</p>
          <span class="study-list__name">${study.nickname}</span>
          <span class="study-list__date">${startDate.getMonth()}월 ${startDate.getDate()}일 - ${endDate.getMonth()}월 ${endDate.getDate()}일</span>
          <ul class="study-list__tags tags">
            ${locationTagHTML}${tagsHTML}
          </ul>
        </div>
      </a>
    </li>`;
  });
  $infoContainer.innerHTML = studyListHTML;

  studyList.length > 1
    ? $infoContainer.classList.add('multiple')
    : $infoContainer.classList.remove('multiple');
};

// Event Listeners
window.addEventListener('DOMContentLoaded', async () => {
  /** @todo get list of item, isActive === "true" */
  const { data } = await axios.get(
    `https://switea-19c19-default-rtdb.firebaseio.com/studies.json`,
  );
  kakaoMap.setMarkers(data, renderMarkered);
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
