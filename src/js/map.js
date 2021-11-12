import * as kakaoMap from './utils/kakaoMap';

const mainArea = document.getElementById('map');
const mapContainer = document.createElement('div');
mapContainer.classList.add('kakaoMap');
mainArea.appendChild(mapContainer);
kakaoMap.initMapView(mapContainer);

// 현재위치 설정
kakaoMap.setGeoMarker();
