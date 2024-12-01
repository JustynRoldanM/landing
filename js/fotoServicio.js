// JavaScript para el modal
const services = document.querySelectorAll('.col-md-4');
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = `
  <div class="modal-content">
    <button class="modal-close">&times;</button>
    <img src="" alt="Imagen del servicio" />
  </div>
`;
document.body.appendChild(modal);

const modalImage = modal.querySelector('img');
const closeModal = modal.querySelector('.modal-close');

services.forEach(service => {
  service.addEventListener('click', () => {
    const imgSrc = service.querySelector('.icon2 img').getAttribute('src');
    modalImage.src = imgSrc;
    modal.classList.add('active');
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});
