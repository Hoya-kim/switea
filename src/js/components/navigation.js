import * as homeActive from '../../images/home_activate.svg';
import * as homeDeactive from '../../images/home_deactivate.svg';
import * as listActive from '../../images/list_activate.svg';
import * as listDeactive from '../../images/list_deactivate.svg';
import * as mapActive from '../../images/map_activate.svg';
import * as mapDeactive from '../../images/map_deactivate.svg';
import * as mypageActive from '../../images/mypage_activate.svg';
import * as mypageDeactive from '../../images/mypage_deactivate.svg';
import * as recruitActive from '../../images/recruit_activate.svg';
import * as recruitDeactive from '../../images/recruit_deactivate.svg';

/**
 * Set font color by page path
 * @param {string} endpoint
 * @returns
 */
const setFontColor = endpoint => {
  const path = window.location.pathname;
  return endpoint === path ? '#5CC6BA' : '#D4D4D4';
};

export default class navigation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /** Excute when the element is created. */
  connectedCallback() {
    this.render();
  }

  /** Render the custom element. */
  render() {
    const endpoint = window.location.pathname;
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          position: fixed;
          width: 100%;
          height: 69px;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          max-width: 768px;
          background-color: #fff;
        }
        ul {
          display: flex;
          justify-content: space-evenly;
          height: 100%;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul li {
          width: 69px;
          height: 100%;
        }
        a {
          display: block;
          width: 100%;
          height: 100%;
          text-decoration:none;
          font-size: 0.8rem;
          text-align: center;
          padding: 44px 4px 4px;
          background-size: 36px 36px;
          background-repeat: no-repeat;
          background-position: center 4px;
        }
        .home {
          background-image: url("${
            endpoint === '/' ? homeActive : homeDeactive
          }");
          color: ${setFontColor('/')};
        }
        .list {
          background-image: url("${
            endpoint === '/list.html' ? listActive : listDeactive
          }");
          color: ${setFontColor('/list.html')};
        }
        .map {
          background-image: url("${
            endpoint === '/map.html' ? mapActive : mapDeactive
          }");
          color: ${setFontColor('/map.html')};
        }
        .recruit {
          background-image: url("${
            endpoint === '/recruit.html' ? recruitActive : recruitDeactive
          }");
          color: ${setFontColor('/recruit.html')};
        }
        .mypage {
          background-image: url("${
            endpoint === '/mypage.html' ? mypageActive : mypageDeactive
          }");
          color: ${setFontColor('/mypage.html')};
        }
      </style>
      `;
    this.shadowRoot.innerHTML += `
      <nav>
        <ul>
          <li><a href="/" class="home">홈</a></li>
          <li><a href="/list.html" class="list">목록보기</a></li>
          <li><a href="/map.html" class="map">지도</a></li>
          <li><a href="/recruit.html" class="recruit">모집하기</a></li>
          <li><a href="/mypage.html" class="mypage">마이페이지</a></li>
        </ul>
      </nav>`;
  }
}
