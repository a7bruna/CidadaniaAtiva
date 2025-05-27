// scriptChamados.js
function openTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

//function fechar() {
//    alert("Fechando o formulário.");
//}

function fechar() { 
    window.location.reload();
}