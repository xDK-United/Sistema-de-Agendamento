function openMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('open');
}

function filtrarCategoria(categoria) {
    let imagens = document.getElementsByTagName('img');
    for(let i = 0; i < imagens.length; i++) {
        if(categoria === 'todas') {
            imagens[i].style.display = 'block';
        } else if(imagens[i].classList.contains(categoria)) {
            imagens[i].style.display = 'block';
        } else {
            imagens[i].style.display = 'none';
        }
    }
}

