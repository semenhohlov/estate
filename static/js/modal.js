const modalBack = document.querySelector('#modal_back');
const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('#modal_title');
const modalBody = document.querySelector('#modal_body');
const modalCloseBtn = document.querySelector('#modal_close_btn');

function showModal(title, body) {
  modalBack.style.display = 'flex';
  modalTitle.innerHTML = title;
  modalBody.innerHTML = body;
};
function closeModal(event) {
  event.preventDefault();
  event.stopPropagation();
  modalBack.style.display = 'none';
};
modal.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
});
modalCloseBtn.addEventListener('click', closeModal);
modalBack.addEventListener('click', closeModal);
