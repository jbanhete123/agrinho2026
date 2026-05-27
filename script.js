// Variáveis de estado da fazenda (começam em 50%)
let producao = 50;
let ambiente = 50;
let jogoAtivo = true;

// Elementos da tela que vamos atualizar
const htmlValProducao = document.getElementById("val-producao");
const htmlValAmbiente = document.getElementById("val-ambiente");
const htmlBarProducao = document.getElementById("bar-producao");
const htmlBarAmbiente = document.getElementById("bar-ambiente");
const htmlMensagem = document.getElementById("mensagem");

function tomarDecisao(acao) {
    if (!jogoAtivo) return;

    if (acao === 'agrotoxico') {
        producao += 20;
        ambiente -= 25;
        htmlMensagem.innerText = "⚠️ O defensivo químico aumentou a produção rápido, mas poluiu o solo e a água!";
    } 
    else if (acao === 'biologico') {
        producao += 10;
        ambiente += 10;
        htmlMensagem.innerText = "🐞 O controle biológico eliminou as pragas naturalmente e protegeu a biodiversidade!";
    } 
    else if (acao === 'gotejamento') {
        producao += 15;
        ambiente += 5;
        htmlMensagem.innerText = "💧 A irrigação por gotejamento economizou muita água e melhorou a colheita!";
    } 
    else if (acao === 'rotacao') {
        producao -= 5;
        ambiente += 25;
        htmlMensagem.innerText = "🔄 A rotação de culturas recuperou os nutrientes do solo para os próximos anos!";
    }

    // Trava os valores entre 0 e 100
    producao = Math.max(0, Math.min(100, producao));
    ambiente = Math.max(0, Math.min(100, ambiente));

    atualizarTela();
    verificarFimDeJogo();
}

function atualizarTela() {
    // Atualiza os números
    htmlValProducao.innerText = producao;
    htmlValAmbiente.innerText = ambiente;

    // Atualiza o tamanho das barras de progresso
    htmlBarProducao.style.width = producao + "%";
    htmlBarAmbiente.style.width = ambiente + "%";
}

function verificarFimDeJogo() {
    if (producao <= 0) {
        htmlMensagem.innerText = "❌ Fim de jogo! Sua produção quebrou e a fazenda faliu.";
        htmlMensagem.style.borderColor = "#d32f2f";
        jogoAtivo = false;
    } else if (ambiente <= 0) {
        htmlMensagem.innerText = "❌ Fim de jogo! O meio ambiente foi destruído e a terra ficou infértil.";
        htmlMensagem.style.borderColor = "#d32f2f";
        jogoAtivo = false;
    } else if (producao >= 80 && ambiente >= 80) {
        htmlMensagem.innerText = "🏆 Parabéns! Você alcançou o Equilíbrio Perfeito! Agro forte e futuro sustentável!";
        htmlMensagem.style.borderColor = "#388e3c";
        jogoAtivo = false;
    }
}

function reiniciarSimulador() {
    producao = 50;
    ambiente = 50;
    jogoAtivo = true;
    htmlMensagem.innerText = "Escolha uma ação para iniciar o manejo da sua fazenda.";
    htmlMensagem.style.borderColor = "#2e7d32";
    atualizarTela();
}