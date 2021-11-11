import flatpickr from 'flatpickr';

const $form = document.querySelector('.recruit-container form');
const $tags = document.querySelector('.recruit-container .tags');
const $addTags = document.querySelector('.recruit-container .add-tags');
const $datepicker = document.querySelector('.datepicker');

let tags = [];

const addTag = content => {
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

flatpickr($datepicker, {
  mode: 'range',
  dateFormat: 'Y.m.d',
  minDate: 'today',
  locale: {
    weekdays: {
      shorthand: ['일', '월', '화', '수', '목', '금', '토'],
      longhand: [
        '일요일',
        '월요일',
        '화요일',
        '수요일',
        '목요일',
        '금요일',
        '토요일',
      ],
    },

    months: {
      shorthand: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      longhand: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
    },

    ordinal: () => '일',

    rangeSeparator: ' ~ ',
  },
});

$addTags.onkeydown = e => {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const content = e.target.value.trim();

  if (content) {
    tags.length < 10
      ? addTag(content)
      : alert('태그는 10개까지 등록 가능합니다.');
  }

  e.target.value = '';
};

$tags.onclick = e => {
  if (!e.target.classList.contains('tag-delete')) return;
  e.preventDefault();

  const allTag = document.querySelectorAll('.tags li');
  tags.splice([...allTag].indexOf(e.target.closest('li')), 1);
  e.target.closest('li').remove();
};

$form.onsubmit = e => {
  e.preventDefault();
};
