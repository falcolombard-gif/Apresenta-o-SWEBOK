const slide = document.getElementById("slide");
const tempoAnimacao = 780;

function aplicarEntrada() {
    if (!slide) {
        return;
    }

    const direcao = localStorage.getItem("direcao-swebok");
    if (direcao === "voltar") {
        slide.classList.add("enter-left");
        return;
    }

    slide.classList.add("enter-right");
}

function navegar(event, destino, direcao) {
    if (event) {
        event.preventDefault();
    }

    localStorage.setItem("direcao-swebok", direcao);
    if (paginaSemDesfoque(destino)) {
        localStorage.removeItem("pagina-desfocada-swebok");
    } else {
        salvarPaginaDesfocada(direcao);
    }

    slide.classList.add(direcao === "voltar" ? "page-out-back" : "page-out-forward");

    setTimeout(() => {
        window.location.href = destino;
    }, tempoAnimacao);
}

function salvarPaginaDesfocada(direcao) {
    if (!slide) {
        return;
    }

    const medidas = slide.getBoundingClientRect();

    localStorage.setItem("pagina-desfocada-swebok", JSON.stringify({
        html: slide.outerHTML,
        direcao,
        lado: direcao === "voltar" ? "direita" : "esquerda",
        largura: medidas.width,
        altura: medidas.height
    }));
}

function mostrarPaginaDesfocada() {
    if (!slide) {
        return;
    }

    if (paginaSemDesfoque(window.location.pathname)) {
        localStorage.removeItem("pagina-desfocada-swebok");
        return;
    }

    const dados = localStorage.getItem("pagina-desfocada-swebok");

    if (!dados) {
        return;
    }

    let paginaSalva;

    try {
        paginaSalva = JSON.parse(dados);
    } catch {
        localStorage.removeItem("pagina-desfocada-swebok");
        return;
    }

    const modelo = document.createElement("template");
    modelo.innerHTML = paginaSalva.html.trim();

    const pagina = modelo.content.firstElementChild;
    const medidas = slide.getBoundingClientRect();
    const largura = paginaSalva.largura || medidas.width;
    const altura = paginaSalva.altura || medidas.height;
    const lado = paginaSalva.lado || (paginaSalva.direcao === "voltar" ? "direita" : "esquerda");
    const deslocamento = Math.min(largura * 0.34, 300);
    const esquerda = lado === "direita"
        ? medidas.left + deslocamento
        : medidas.left - deslocamento;
    const topo = medidas.top + (medidas.height - altura) / 2;

    document.body.classList.add(lado === "direita" ? "book-current-left" : "book-current-right");

    pagina.removeAttribute("id");
    pagina.setAttribute("aria-hidden", "true");
    pagina.classList.remove("enter-left", "enter-right", "page-out-back", "page-out-forward");
    pagina.classList.add("page-ghost", lado === "direita" ? "page-ghost-fixed-right" : "page-ghost-fixed-left");
    pagina.style.width = `${largura}px`;
    pagina.style.height = `${altura}px`;
    pagina.style.minHeight = "0";
    pagina.style.left = `${esquerda}px`;
    pagina.style.top = `${topo}px`;

    document.body.appendChild(pagina);
}

function paginaSemDesfoque(caminho) {
    const pagina = decodeURIComponent(caminho.split("/").pop() || "index.html").toLowerCase();
    return pagina === "index.html" || pagina === "conclusão.html";
}

function irIntroducao() {
    navegar(null, "index.html", "voltar");
}

function finalizar() {
    const overlay = document.getElementById("overlay");

    slide.classList.add("page-out-forward");

    setTimeout(() => {
        overlay.classList.add("show");
    }, 500);

    setTimeout(() => {
        alert("Apresentacao finalizada!");
    }, 1400);
}

mostrarPaginaDesfocada();
aplicarEntrada();
