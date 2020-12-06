const submitModal = document.querySelectorAll('.submitModal');
const modal = document.querySelector('.modal-container');
const cancelModal = document.getElementById('cancelModal');
const acceptModal = document.getElementById('acceptModal');

submitModal.forEach((s) => {
    s.addEventListener('submit', function (event) {
        event.preventDefault();
        modal.classList.add('modal-show');

        cancelModal.addEventListener('click', function () {
            modal.classList.remove('modal-show');
        });

        acceptModal.addEventListener('click', function () {
            modal.classList.remove('modal-show');
            event.target.submit();
        });

        window.addEventListener('click', function (e) {
            return e.target == modal
                ? modal.classList.remove('modal-show')
                : false;
        });
    });
});
