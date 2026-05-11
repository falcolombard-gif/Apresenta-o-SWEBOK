const CHAVE_DIRECAO_LIVRO = "direcaoAnimacaoLivro";
let transicaoEmAndamento = false;

function prepararEntradaLivro() {
    const slide = document.getElementById("slide");
    const direcao = sessionStorage.getItem(CHAVE_DIRECAO_LIVRO);

    if (!slide || !direcao) {
        return;
    }

    sessionStorage.removeItem(CHAVE_DIRECAO_LIVRO);
    slide.classList.add(direcao === "voltar" ? "book-enter-back" : "book-enter-forward");
}

function obterDirecaoDoBotao(botao) {
    return botao.textContent.includes("Voltar") ? "voltar" : "avancar";
}

function navegarComAnimacao(destino, direcao) {
    const slide = document.getElementById("slide");

    if (!slide || transicaoEmAndamento) {
        return;
    }

    transicaoEmAndamento = true;
    sessionStorage.setItem(CHAVE_DIRECAO_LIVRO, direcao);
    slide.classList.add(direcao === "voltar" ? "page-out-back" : "page-out-forward");

    setTimeout(() => {
        window.location.href = destino;
    }, 800);
}

function transicao(event) {
    event.preventDefault();

    const botao = event.currentTarget;
    const destino = botao.getAttribute("data-link");
    const direcao = obterDirecaoDoBotao(botao);

    navegarComAnimacao(destino, direcao);
}

function irIntroducao() {
    navegarComAnimacao("Index.html", "voltar");
}

function finalizar() {
    const slide = document.getElementById("slide");
    const overlay = document.getElementById("overlay");

    slide.classList.add("page-out-forward");

    setTimeout(() => {
        overlay.classList.add("show");
    }, 500);

    setTimeout(() => {
        alert("Apresentação finalizada!");
    }, 1400);
}

function acionarNavegacaoPorTecla(event) {
    const tecla = event.key;

    if (tecla !== "ArrowRight" && tecla !== "ArrowLeft") {
        return;
    }

    event.preventDefault();

    const botoes = Array.from(document.querySelectorAll("button[data-link]"));
    const destino = tecla === "ArrowRight"
        ? botoes.find((botao) => !botao.textContent.includes("Voltar"))
        : botoes.find((botao) => botao.textContent.includes("Voltar"));

    if (destino) {
        destino.click();
    }
}

document.addEventListener("DOMContentLoaded", prepararEntradaLivro);
document.addEventListener("keydown", acionarNavegacaoPorTecla);
