import Swal from 'sweetalert2';

let tags = [];

const getTags = () => tags;

const setTag = (content, $tags) => {
  const $tag = document.createElement('li');
  const $tagDelete = document.createElement('button');
  $tag.className = 'tag';
  $tag.textContent = `#${content}`;
  $tagDelete.className = 'tag-delete';
  $tagDelete.textContent = 'X';
  $tag.appendChild($tagDelete);
  $tags.appendChild($tag);

  tags = [...tags, content];
};

const addTag = (e, TAG_CONSTANTS, $tags) => {
  if (e.isComposing || e.key !== 'Enter') return;
  const content = e.target.value.trim();

  if (content) {
    getTags().length < TAG_CONSTANTS.MAX_LENGTH
      ? setTag(content, $tags)
      : Swal.fire({
          text: TAG_CONSTANTS.ALERT_MESSAGE,
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: '확인',
        });
  }
  e.target.value = '';
};

const removeTag = e => {
  if (!e.target.classList.contains('tag-delete')) return;

  const allTag = document.querySelectorAll('.tags li');
  getTags().splice([...allTag].indexOf(e.target.closest('li')), 1);
  e.target.closest('li').remove();
};

export { getTags, addTag, removeTag };
