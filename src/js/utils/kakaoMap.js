import axios from 'axios';

import * as pinMarker from '../../images/pinMarker.svg';

const { kakao } = window;

const BASE_URL = 'https://dapi.kakao.com/v2/local/search';

/**
 * @constant {string} accessToken 카카오 API 접근 토큰
 */
const accessToken = `183967433118475fce82dc441bd2676c`;

/**
 * @constant {object} service axios instance
 */
const service = axios.create({
  baseURL: BASE_URL, // api base url
});

/** Set request interceptor */
service.interceptors.request.use(
  config => {
    config.headers.Authorization = `KakaoAK ${accessToken}`;
    return config;
  },
  error => {
    console.log(error);
  },
);

/**
 * @constant {Object} INITIAL_COORDS 지도 초기 좌표
 */
const INITIAL_COORDS = {
  // 강남역
  LAT: 37.4981588,
  LNG: 127.0278715,
};

/**
 * @constant {Object} options 지도 생성을 위한 초기 옵션
 */
const options = {
  center: new kakao.maps.LatLng(INITIAL_COORDS.LAT, INITIAL_COORDS.LNG), // 지도의 중심좌표.
  level: 3, // 지도의 레벨(확대, 축소 정도)
};

/** 지도 뷰를 위한 객체 */
let map; // 지도

/**
 * @description 현재 위치를 표시하는 마커 생성
 */
const setGeoMarker = () => {
  // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
  if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords; // 위도, 경도

      const locPosition = new kakao.maps.LatLng(latitude, longitude); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
      map.panTo(locPosition);

      const geoMarker = `<div class="marker"><div class="dot"></div><div class="pulse"></div></div>`;
      const currentGeoMarker = new kakao.maps.CustomOverlay({
        position: locPosition,
        content: geoMarker,
        map,
      });
      currentGeoMarker.setMap(map);
    });
  } else {
    // HTML5의 GeoLocation을 사용할 수 없을 때
    alert('스터디 검색을 위해 위치 정보가 필요해요 😭');
  }
};

/**
 * @description 지도 생성
 * @param {Element} mapContainer 지도 뷰를 삽입할 Element
 */
const initMapView = mapContainer => {
  map = new kakao.maps.Map(mapContainer, options); // 지도 생성 및 객체 리턴
};

/**
 * Search by keyword on kakao map API
 * @param {string} query search keyword
 * @param {number} [page=1] page number
 * @param {number} [size=15] page size
 * @param {string} [sort='accuracy'] sort by 'accuracy' or 'distance'
 * @returns {Promise<object>} search result
 */
const searchByKeyword = async (
  query,
  page = 1,
  size = 15,
  sort = 'accuracy',
) => {
  try {
    const url = `${BASE_URL}/keyword.json?query=${query}&page=${page}&size=${size}&sort=${sort}`;
    const { data } = await service.get(url);
    return data;
  } catch (e) {
    console.error(e);
  }
};

/**
 * @description 지도에 마커를 표시하는 함수
 * @param {Array} studies - Array of study object
 */
const setMarkers = studies => {
  const imageSize = new kakao.maps.Size(56, 56);
  const markerImage = new kakao.maps.MarkerImage(pinMarker, imageSize);

  // 클러스터 마커 속성 설정
  const clusterer = new kakao.maps.MarkerClusterer({
    map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 1, // 클러스터 할 최소 지도 레벨
    styles: [
      {
        width: '50px',
        height: '50px',
        background: 'rgba(92, 198, 186, 0.85)',
        borderRadius: '25px',
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '51px',
      },
    ],
  });

  // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
  const makeOverListener = (map, marker, infowindow) => () =>
    infowindow.open(map, marker);

  // 인포윈도우를 닫는 클로저를 만드는 함수입니다
  const makeOutListener = infowindow => () => infowindow.close();

  const markers = Object.values(studies).map(
    ({ title, location: { placeName, x: longitude, y: latitude } }) => {
      // 마커에 표시할 인포윈도우를 생성합니다
      const infowindow = new kakao.maps.InfoWindow({
        content: `<div>${title}</div>`, // 인포윈도우에 표시할 내용
      });

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(latitude, longitude),
        image: markerImage,
      });

      kakao.maps.event.addListener(
        marker,
        'mouseover',
        makeOverListener(map, marker, infowindow),
      );

      kakao.maps.event.addListener(
        marker,
        'mouseout',
        makeOutListener(infowindow),
      );

      return marker;
    },
  );
  // 마커 추가
  clusterer.addMarkers(markers);
};

/**
 * @todo 카테고리로 검색
 */

/**
 * @todo 실시간 위치를 파악하는 함수
 */

export { initMapView, setGeoMarker, searchByKeyword, setMarkers };
