const getGeoLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords; // 위도, 경도
          resolve({ latitude, longitude });
        })
      : reject('위치 정보 에러');
  });

export default getGeoLocation;
