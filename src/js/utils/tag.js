const $tags = document.querySelector('.recruit-container .tags');

let tags = [];

const getTags = () => tags;

const setTag = content => {
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

const addTag = (e, maxTagLength, alertMessage) => {
  if (e.key !== 'Enter') return;
  const content = e.target.value.trim();

  if (content) {
    getTags().length < maxTagLength ? setTag(content) : alert(alertMessage);
  }
  e.target.value = '';
};

const removeTag = e => {
  if (!e.target.classList.contains('tag-delete')) return;

  const allTag = document.querySelectorAll('.tags li');
  getTags().splice([...allTag].indexOf(e.target.closest('li')), 1);
  e.target.closest('li').remove();

  console.log(getTags());
};

export { getTags, addTag, removeTag };
