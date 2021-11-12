const $filterToggleButton = document.querySelector('.filter__toggle-button');
const $modalContainer = document.querySelector('.filter__modal-container');
const $modalCloseButton = document.querySelector('.filter__modal-close');

const modalToggle = () => {
  const isToggleBtnActive = $filterToggleButton.classList.contains('active');

  $filterToggleButton.classList.toggle('active');
  $filterToggleButton.innerHTML = isToggleBtnActive ? '필터 열기' : '필터 닫기';
  $modalContainer.style.display = isToggleBtnActive ? 'none' : 'block';
};

[$filterToggleButton, $modalContainer, $modalCloseButton].forEach($el => {
  $el.onclick = e => {
    if (e.target !== $el) return;
    modalToggle();
  };
});
