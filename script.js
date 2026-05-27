// Atributos de Jogo
let producao = 0;
let sustentabilidade = 50;
let estagioPlanta = 0; // 0: Vazio, 1: Semente, 2: Crescendo, 3: Pronto
let sensoresLigados = false;
let painelSolarLigado = false;
let jogoAtivo = true;
let tempoCrescimento = null;

// Elementos da Interface
const txtProd = document.getElementById("txt-prod");
const txtSust = document.getElementById("txt-sust");
const barProd = document.getElementById("bar-prod");
const barSust = document.getElementById("bar-sust");

const charAvatar = document.getElementById("char-avatar");
const charText = document.getElementById("char-text");
const estufaEstrutura = document.getElementById("estufa-estrutura");
const solarRoof = document.getElementById("solar-roof");
const climaEfeito = document.getElementById("efeito-clima");

const btnPlantar = document.getElementById("btn-plantar");
const btnColher = document.getElementById("btn-colher");

// ID das plantas do cenário
const plantasIds = ["p1", "p2", "p3", "p4"];

function jogar(acao) {
    if (!jogoAtivo) return;

    if (acao === 'plantar' && estagioPlanta === 0) {
        estagioPlanta = 1;
        btnPlantar.disabled = true;
        
        // Aplica regras de sustentabilidade baseadas nos upgrades ativos
        if (sensoresLigados) {
            sustentabilidade += 10;
            atualizarPersonagem("🤖✨", "Sensores ativos! Irrigação sob medida liberada. Economia total de água!");
            ativarEfeitoClima(true);
        } else {
            sustentabilidade -= 15;
            atualizarPersonagem("👨‍🌾💦", "Plantamos! Mas gastamos muita água manual... nossa sustentabilidade caiu.");
        }
        
        atualizarVisualPlantas("🌱");
        iniciarCicloCrescimento();
    }

    else if (acao === 'colher' && estagioPlanta === 3) {
        producao += 25;
        estagioPlanta = 0;
        btnPlantar.disabled = false;
        btnColher.disabled = true;
        
        atualizarVisualPlantas("🟫");
        atualizarPersonagem("🤖🎉", "Que colheita linda! Verduras frescas prontas para distribuição!");
        
        verificarFinais();
    }

    else if (acao === 'sensor') {
        sensoresLigados = true;
        sustentabilidade += 10;
        document.getElementById("btn-sensor").disabled = true;
        atualizarPersonagem("🤖📡", "Módulos IoT online! Monitoramento de solo ativado.");
    }

    else if (acao === 'solar') {
        painelSolarLigado = true;
        sustentabilidade += 15;
        solarRoof.classList.remove("hidden");
        document.getElementById("btn-solar").disabled = true;
        atualizarPersonagem("🤖☀️", "Energia fotovoltaica integrada! Agora somos 100% limpos.");
    }

    // Limites de segurança das métricas
    sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));
    atualizarTelasERecursos();
}

// Controla o tempo de crescimento real na estufa
function iniciarCicloCrescimento() {
    let contador = 0;
    tempoCrescimento = setInterval(() => {
        contador++;
        if (contador === 1) {
            estagioPlanta = 2;
            atualizarVisualPlantas("🌿");
            ativarEfeitoClima(false); // desliga a animação da água
        } else if (contador === 2) {
            estagioPlanta = 3;
            atualizarVisualPlantas("🥬");
            btnColher.disabled = false;
            atualizarPersonagem("🤖📢", "Atenção: As alfaces cresceram! Pronto para colheita.");
            clearInterval(tempoCrescimento);
        }
    }, 3000); // Avança a cada 3 segundos
}

// Altera as plantas nos vasos do cenário
function atualizarVisualPlantas(emoji) {
    plantasIds.forEach(id => {
        document.getElementById(id).innerText = emoji;
        // Pequena animação de pulo ao mudar de estágio
        document.getElementById(id).style.transform = "scale(1.2)";
        setTimeout(() => document.getElementById(id).style.transform = "scale(1)", 200);
    });
}

// Altera o humor e texto do robô/personagem
function atualizarPersonagem(avatar, texto) {
    charAvatar.innerText = avatar;
    charText.innerText = texto;
}

function ativarEfeitoClima(ativo) {
    if (ativo) climaEfeito.classList.add("chuva-ativa");
    else climaEfeito.classList.remove("chuva-ativa");
}

function atualizarTelasERecursos() {
    txtProd.innerText = producao;
    txtSust.innerText = sustentabilidade;
    barProd.style.width = Math.min(100, producao) + "%";
    barSust.style.width = sustentabilidade + "%";

    // MUDANÇA DE APARÊNCIA DA ESTUFA
    estufaEstrutura.className = "greenhouse-frame"; // Limpa classes
    if (sustentabilidade <= 30) {
        estufaEstrutura.classList.add("estufa-poluida");
        if(jogoAtivo) atualizarPersonagem("🤖⚠️", "Alerta! A estufa está ficando sem recursos sustentáveis!");
    } else if (sustentabilidade >= 70) {
        estufaEstrutura.classList.add("estufa-perfeita");
    } else {
        estufaEstrutura.classList.add("estufa-normal");
    }
}

function verificarFinais() {
    if (sustentabilidade <= 0) {
        jogoAtivo = false;
        clearInterval(tempoCrescimento);
        atualizarPersonagem("💀❌", "Fim de Jogo! O ecossistema desmoronou devido ao uso excessivo de recursos.");
    } else if (producao >= 100 && sustentabilidade >= 70) {
        jogoAtivo = false;
        clearInterval(tempoCrescimento);
        atualizarPersonagem("🏆👑", "Vitória Perfeita! Você atingiu a meta de produção em total harmonia com o Meio Ambiente!");
    }
}

function reiniciarJogo() {
    clearInterval(tempoCrescimento);
    producao = 0;
    sustentabilidade = 50;
    estagioPlanta = 0;
    sensoresLigados = false;
    painelSolarLigado = false;
    jogoAtivo = true;

    document.getElementById("btn-sensor").disabled = false;
    document.getElementById("btn-solar").disabled = false;
    btnPlantar.disabled = false;
    btnColher.disabled = false;
    solarRoof.classList.add("hidden");
    ativarEfeitoClima(false);
    
    atualizarVisualPlantas("🟫");
    atualizarPersonagem("🤖", "Sistema reiniciado. Vamos tentar o equilíbrio perfeito?");
    atualizarTelasERecursos();
}