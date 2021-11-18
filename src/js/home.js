import spinner from './components/spinner';

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
