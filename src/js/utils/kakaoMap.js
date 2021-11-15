import axios from 'axios';

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

/** request interceptor */
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
 *
 * @param {string} query
 * @param {number} [page=1]
 * @param {number} [size=15]
 * @param {string} [sort='accuracy']
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
 * @todo 카테고리로 검색
 * @param {string} category
 */
const searchByCategory = async (coords = INITIAL_COORDS) => {
  const cafeCode = 'CE7';

  // try {
  //   const result = await service.get(
  //     `${BASE_URL}/category.json?category\_group\_code=${cafeCode}&x=${coords.LNG}&y=${coords.LAT}&radius=3000`,
  //   );
  //   console.log(result);
  // } catch (e) {
  //   console.error(e);
  // }
};

/**
 * @todo 지도에 마커를 표시하는 함수
 */

/**
 * @todo 실시간 위치를 파악하는 함수
 */

export { initMapView, setGeoMarker, searchByKeyword };
