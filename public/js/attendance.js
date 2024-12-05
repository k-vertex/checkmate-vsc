const modal = document.querySelector('.modal');
const openModalButton = document.querySelector('.fa-wrench'); 
const closeModalButton = document.querySelector('.close'); 

openModalButton.addEventListener('click', () => {
    modal.classList.remove('hidden'); 
});

closeModalButton.addEventListener('click', () => {
    modal.classList.add('hidden'); 
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden'); 
    }
});
