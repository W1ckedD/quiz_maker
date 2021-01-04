const btnT = document.getElementById('btnT');
const btnMc = document.getElementById('btnMc');
const tQuestion = document.getElementById('tQuestion');
const mcQuestion = document.getElementById('mcQuestion');

btnMc.addEventListener('click', function (e) {
    btnMc.classList.add('btn-tab-active');
    btnT.classList.remove('btn-tab-active');
    mcQuestion.classList.add('show');
    tQuestion.classList.remove('show');
});

btnT.addEventListener('click', function (e) {
    btnT.classList.add('btn-tab-active');
    btnMc.classList.remove('btn-tab-active');
    tQuestion.classList.add('show');
    mcQuestion.classList.remove('show');
});
