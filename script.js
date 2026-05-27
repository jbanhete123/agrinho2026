// Variáveis de controle
let producaoAcumulada = 0;
let sustentabilidade = 60;
let estagioPlanta = 0; // 0: Vazio, 1: Semente, 2: Brotando, 3: Pronto
let irrigacaoAutomatica = false;
let painelSolarLigado = false;
let loopCrescimento = null;

// Elementos HTML
const htmlProducao = document.getElementById("val-producao");
const htmlSustentabilidade = document.getElementById("val-sustentabilidade");
const htmlBarProducao = document.getElementById("bar-producao");
const htmlBarSustentabilidade = document.getElementById("bar-sustentabilidade");
const htmlMensagem = document.getElementById("mensagem");
const htmlCanteiro = document.getElementById("canteiro");
const htmlPlantaIcone = document.getElementById("planta-icone");
const htmlPlantaStatus = document.getElementById("planta-status");

const btnPlantar = document.getElementById("btn-plantar");
const btnColher = document.getElementById("btn-colher");
const htmlStatusIrrigacao = document.getElementById("status-irrigacao");

// Função para plantar
function plantar() {
    if (estagioPlanta === 0) {
        estagioPlanta = 1;
        btnPlantar.disabled = true;
        
        // Impacto inicial do plantio tradicional
        if (!irrigacaoAutomatica) {
            sustentabilidade -= 10;
            htmlMensagem.innerText = "💧 Sementes plantadas! Sem irrigação inteligente, o gasto manual de água reduziu a sustentabilidade.";
        } else {
            sustentabilidade += 5;
            htmlMensagem.innerText = "🤖 Sementes plantadas! Os sensores de umidade detectaram o plantio e liberaram água na dose exata.";
        }
        
        atualizarInterfaceCanteiro();
        iniciarCrescimento();
    }
}

// Simulador de crescimento baseado no tempo
function iniciarCrescimento() {
    loopCrescimento = setInterval(() => {
        if (estagioPlanta < 3) {
            estagioPlanta++;
            
            // Consumo de energia/recursos durante o crescimento
            if (!painelSolarLigado) {
                sustentabilidade -= 5;
            } else {
                sustentabilidade += 2; // Energia limpa gera bônus ambiental
            }
            
            sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));
            atualizarInterfaceCanteiro();
            verificarStatusEstufa();
        } else {
            clearInterval(loopCrescimento); // Para o timer quando crescer tudo
        }
    }, 4000); // Muda de estágio a cada 4 segundos
}

// Atualiza o desenho e texto do canteiro
function atualizarInterfaceCanteiro() {
    if (estagioPlanta === 0) {
        htmlPlantaIcone.innerText = "🟫";
        htmlPlantaStatus.innerText = "Canteiro Vazio. Pronto para o plantio!";
        btnColher.disabled = true;
        btnPlantar.disabled = false;
    } else if (estagioPlanta === 1) {
        htmlPlantaIcone.innerText = "🌱";
        htmlPlantaStatus.innerText = "Estágio: Semente germinando...";
    } else if (estagioPlanta === 2) {
        htmlPlantaIcone.innerText = "🌿";
        htmlPlantaStatus.innerText = "Estágio: Verdura em crescimento foliar.";
    } else if (estagioPlanta === 3) {
        htmlPlantaIcone.innerText = "🥬";
        htmlPlantaStatus.innerText = "Estágio: Pronto para Colheita!";
        btnColher.disabled = false;
        htmlMensagem.innerText = "📢 Sensores indicam: As verduras atingiram o tamanho ideal! Pode colher.";
    }
    
    // Atualiza barras
    htmlSustentabilidade.innerText = sustentabilidade;
    htmlBarSustentabilidade.style.width = sustentabilidade + "%";
}

// Função para colher
function colher() {
    if (estagioPlanta === 3) {
        producaoAcumulada += 25;
        estagioPlanta = 0;
        
        htmlProducao.innerText = producaoAcumulada;
        // Limita a barra de produção visual até 100% (meta do jogo)
        htmlBarProducao.style.width = Math.min(100, producaoAcumulada) + "%"; 
        
        htmlMensagem.innerText = "🧺 Sucesso! Verduras colhidas e prontas para o consumo/venda.";
        
        atualizarInterfaceCanteiro();
        verificarStatusEstufa();
    }
}

// Alternar Irrigação Inteligente
function toggleIrrigacao() {
    irrigacaoAutomatica = !irrigacaoAutomatica;
    if (irrigacaoAutomatica) {
        htmlStatusIrrigacao.innerText = "LIGADA (Sensores Ativos)";
        htmlStatusIrrigacao.style.color = "#2ecc71";
        htmlMensagem.innerText = "💧 Sensores de gotejamento ativados. Economia de 40% de recursos hídricos.";
    } else {
        htmlStatusIrrigacao.innerText = "DESLIGADA";
        htmlStatusIrrigacao.style.color = "#e74c3c";
    }
}

// Ativar Painéis Solares
function ativarPainelSolar() {
    painelSolarLigado = true;
    sustentabilidade += 15;
    sustentabilidade = Math.min(100, sustentabilidade);
    htmlMensagem.innerText = "☀️ Painéis fotovoltaicos conectados. Toda a automação agora roda com energia limpa!";
    atualizarInterfaceCanteiro();
}

// Verifica as regras de vitória ou derrota do Agrinho
function verificarStatusEstufa() {
    if (sustentabilidade <= 0) {
        clearInterval(loopCrescimento);
        htmlMensagem.innerText = "❌ Alerta Crítico! A estufa gastou muita água/energia fóssil.