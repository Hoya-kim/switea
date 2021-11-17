/**
 * @description Attach a spinner to an target element.
 * @param {Element} $parentElement The target to which the spinner will be attached
 */
const addOnView = $parentElement => {
  const $spinner = document.createElement('div');
  $spinner.classList.add('spinner');
  $spinner.innerHTML = `
    <object type="image/svg+xml" data="../images/spinner_switea.svg">
      <img src="../images/spinner_switea.svg" />
    </object>`;
  $parentElement.appendChild($spinner);
};

/** @description Remove the spinner */
const removeOnView = () => {
  document.querySelectorAll('.opacity-0').forEach($el => {
    $el.classList.remove('opacity-0');
  });
  document.querySelector('.spinner').remove();
};

const spinner = { addOnView, removeOnView };

export default spinner;
