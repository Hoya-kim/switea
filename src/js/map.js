// kakaoMap.searchByCategory();
// kakaoMap.searchByKeyword('동판교로 123 푸르지오');
// kakaoMap.search('강남');

// import { initializeApp } from 'firebase/app';
// import { initializeApp } from 'firebase/app';
// import { getDatabase } from 'firebase-admin/database';
import axios from 'axios';
import * as kakaoMap from './utils/kakaoMap';

const mainArea = document.getElementById('map');
const mapContainer = document.createElement('div');
mapContainer.classList.add('kakaoMap');
mainArea.appendChild(mapContainer);
kakaoMap.initMapView(mapContainer);

// 현재위치 설정
kakaoMap.setGeoMarker();

// kakaoMap.setMarkers(sample);
(async () => {
  const { data } = await axios.get(
    `https://switea-19c19-default-rtdb.firebaseio.com/studies.json`,
  );
  kakaoMap.setMarkers(data);
})();
