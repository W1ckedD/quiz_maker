const alert = document.getElementById('alert');
const dismiss = document.getElementById('dismiss');

dismiss.addEventListener('click', function(e) {
    alert.classList.remove('show');
})