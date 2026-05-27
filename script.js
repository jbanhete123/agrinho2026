// ==========================================
// ESTADO DO JOGO (VARIÁVEIS GLOBAIS)
// ==========================================
let colheitaKgs = 0;
let sustentabilidade = 50;
let cicloEstagio = 0; // 0: Vazio, 1: Semente, 2: Crescendo, 3: Pronto
let iotAtivo = false;
let solarAtivo = false;
let jogoRodando = true;
let timerCrescimento = null;

// ==========================================
// CAPTURA DOS ELEMENTOS DO HTML (DOM)
// ==========================================
const txtProducao = document.getElementById("txt-producao");
const txtSustentabilidade = document.getElementById("txt-sustentabilidade");
const barProducao = document.getElementById("bar-producao");
const barSustentabilidade = document.getElementById("bar-sustentabilidade");

const botAvatar = document.getElementById("bot-avatar");
const botTexto = document.getElementById("bot-texto");
const estufaGrafica = document.getElementById("estufa-grafica");
const placaSolarVisual = document.getElementById("placa-solar-visual");
const terminalLog = document.getElementById("terminal-log");

const btnPlantar = document.getElementById("btn-plantar");
const btnColher = document.getElementById("btn-colher");
const btnSensor = document.getElementById("btn-sensor");
const btnSolar = document.getElementById("btn-solar");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Lista com os IDs dos vasos para manipulação em lote
const vasos = ["v1", "v2", "v3", "v4"];

// ==========================================
// SISTEMA DE ESCUTA DE CLIQUES (MODERNO)
// ==========================================
btnPlantar.addEventListener("click", acaoPlantar);
btnColher.addEventListener("click", acaoColher);
btnSensor.addEventListener("click", ativarIot);
btnSolar.addEventListener("click", ativarSolar);
btnReiniciar.addEventListener("click", reiniciarJogo);

// ==========================================
// FUNÇÕES DE MANEJO DA ESTUFA
// ==========================================

function acaoPlantar() {
    if (!jogoRodando || cicloEstagio !== 0) return;

    cicloEstagio = 1;
    btnPlantar.disabled = true;
    logarTerminal("Comando recebido: Plantio iniciado.");

    if (iotAtivo) {
        sustentabilidade += 10;
        atualizarBot("🤖✨", "Sensores detectaram as sementes! Irrigação por gotejamento ativada com precisão.");
    } else {
        sustentabilidade -= 15;
        atualizarBot("👨‍🌾⚠️", "Plantamos, mas o gasto de água manual sem sensores reduziu a eficiência ecológica.");
    }

    atualizarVasosCenário("🌱");
    atualizarDadosInterface();
    
    // Inicia o crescimento cronometrado
    dispararTemporizador();
}

function dispararTemporizador() {
    let passos = 0;
    timerCrescimento = setInterval(() => {
        passos++;
        if (passos === 1) {
            cicloEstagio = 2;
            atualizarVasosCenário("🌿");
            logarTerminal("Sensores: Plantas entrando em fase vegetativa.");
        } else if (passos === 2) {
            cicloEstagio = 3;
            atualizarVasosCenário("🥬");
            btnColher.disabled = false;
            atualizarBot("🤖📢", "As alfaces atingiram maturação ideal! Pronto para colheita.");
            logarTerminal("Notificação: Cultivo pronto para comercialização.");
            clearInterval(timerCrescimento);
        }
    }, 2500); // Avança os estágios a cada 2.5 segundos
}

function acaoColher() {
    if (cicloEstagio !== 3) return;

    colheitaKgs += 25;
    cicloEstagio = 0;
    btnPlantar.disabled = false;
    btnColher.disabled = true;

    atualizarVasosCenário("🟫");
    logarTerminal(`Sucesso: +25kg colhidos. Total: ${colheitaKgs}kg.`);
    atualizarBot("🤖🎉", "Ótimo trabalho! Alfaces colhidas sem agrotóxicos e prontas para o consumo.");

    // Se a energia solar estiver ativa, gera bônus na colheita
    if (solarAtivo) {
        sustentabilidade += 5;
        logarTerminal("Bônus Solar: Processamento pós-colheita utilizou 100% de energia limpa.");
    }

    atualizarDadosInterface();
    testarCondicoesDeFim();
}

// ==========================================
// UPGRADES TECNOLÓGICOS (EQUILÍBRIO AMBIENTAL)
// ==========================================

function ativarIot() {
    iotAtivo = true;
    btnSensor.disabled = true;
    sustentabilidade += 10;
    logarTerminal("Sistema: Sensores de umidade do solo instalados com sucesso.");
    atualizarBot("🤖📡", "Agora controlamos a umidade via IoT. Chega de desperdiçar água!");
    atualizarDadosInterface();
}

function ativarSolar() {
    solarAtivo = true;
    btnSolar.disabled = true;
    sustentabilidade += 15;
    placaSolarVisual.classList.remove("escondido");
    logarTerminal("Infraestrutura: Painéis solares fotovoltaicos conectados à rede.");
    atualizarBot("🤖☀️", "Estufa operando com energia limpa! Emissão de carbono zerada.");
    atualizarDadosInterface();
}

// ==========================================
// FUNÇÕES AUXILIARES DA INTERFACE
// ==========================================

function atualizarDadosInterface() {
    sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));
    
    txtProducao.innerText = colheitaKgs;
    txtSustentabilidade.innerText = sustentabilidade;
    
    barProducao.style.width = Math.min(100, colheitaKgs) + "%";
    barSustentabilidade.style.width = sustentabilidade + "%";

    // Altera as cores da estufa com base na sustentabilidade
    if (sustentabilidade <= 30) {
        estufaGrafica.className = "estufa estufa-alerta";
    } else if (sustentabilidade >= 70) {
        estufaGrafica.className = "estufa estufa-sustentavel";
    } else {
        estufaGrafica.className = "estufa estufa-agua";
    }
}

function atualizarVasosCenário(emoji) {
    vasos.forEach(id => {
        document.getElementById(id).innerText = emoji;
    });
}

function atualizarBot(avatar, texto) {
    botAvatar.innerText = avatar;
    botTexto.innerText = texto;
}

function logarTerminal(mensagem) {
    const data = new Date();
    const hora = data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    terminalLog.innerHTML += `<p>[${hora}] > ${mensagem}</p>`;
    terminalLog.scrollTop = terminalLog.scrollHeight; // Auto-scroll para baixo
}

// ==========================================
// REGRAS DE VITÓRIA E DERROTA
// ==========================================

function testarCondicoesDeFim() {
    if (sustentabilidade <= 0) {
        jogoRodando = false;
        clearInterval(timerCrescimento);
        atualizarBot("💀❌", "A estufa faliu! O esgotamento dos recursos hídricos destruiu o solo.");
        logarTerminal("CRÍTICO: Simulação encerrada por colapso ambiental.");
        bloquearPainel();
    } else if (colheitaKgs >= 100 && sustentabilidade >= 70) {
        jogoRodando = false;
        clearInterval(timerCrescimento);
        atualizarBot("🏆👑", "Vitória! Você alcançou o equilíbrio perfeito do Agrinho: Agro forte e sustentável!");
        logarTerminal("SUCESSO: Meta atingida em harmonia com o meio ambiente.");
        bloquearPainel();
    }
}

function bloquearPainel() {
    btnPlantar.disabled = true;
    btnColher.disabled = true;
    btnSensor.disabled = true;
    btnSolar.disabled = true;
}

function reiniciarJogo() {
    clearInterval(timerCrescimento);
    colheitaKgs = 0;
    sustentabilidade = 50;
    cicloEstagio = 0;
    iotAtivo = false;
    solarAtivo = false;
    jogoRodando = true;

    btnPlantar.disabled = false;
    btnColher.disabled = true;
    btnSensor.disabled = false;
    btnSolar.disabled = false;
    placaSolarVisual.classList.add("escondido");
    
    terminalLog.innerHTML = "<p>> Sistema reiniciado. Aguardando novo ciclo...</p>";
    atualizarVasosCenário("🟫");
    atualizarBot("🤖", "Nova simulação carregada. Consegue vencer equilibrando o sistema desta vez?");
    atualizarDadosInterface();
}

// Execução inicial de teste para garantir sincronia do JS
logarTerminal("Núcleo operacional carregado e pronto.");