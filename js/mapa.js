// js/mapa.js - Gerenciamento do Mapa de Calor (Heatmap) do EcoVetor

// 1. CONFIGURAÇÃO DA API
// Substitua a URL abaixo pelo link gerado pelo Render após o deploy do seu Back-end
const CONFIG = {
    API_URL: "https://ecovetor-backend.onrender.com" // Exemplo: cole aqui a sua URL real
};

let map;
let camadaCalor;

// 2. INICIALIZAÇÃO DO MAPA
// Coordenadas centrais ajustadas para a região de monitoramento (Manhuaçu)
function inicializarMapa(idElemento = 'map', lat = -20.2581, lng = -42.0353, zoom = 14) {
    const mapaElemento = document.getElementById(idElemento);
    if (!mapaElemento) return;

    map = L.map(idElemento).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Dispara a primeira carga do mapa térmico assim que o mapa base carregar
    carregarMapaDeCalor();
}

// 3. BUSCA DOS DADOS E CÁLCULO DE CALOR
async function carregarMapaDeCalor() {
    if (!map) return;

    try {
        // Faz a requisição GET na rota de focos da sua API
        const response = await fetch(`${CONFIG.API_URL}/api/focos`);
        
        if (!response.ok) {
            console.warn("API retornou um erro. Renderizando pontos simulados (Fallback).");
            renderizarCalor(obterDadosSimulados());
            return;
        }

        const focos = await response.json();
        
        /* Converte os registros do banco para o padrão Leaflet.heat: [lat, lng, intensidade]
           A intensidade vai de 0.2 (frio/verde) até 1.0 (crítico/vermelho) */
        const dadosCalor = focos.map(foco => {
            const latitude = foco.latitude || foco.lat;
            const longitude = foco.longitude || foco.lng;
            const qtdFocos = foco.quantidade_focos || foco.focos || 0;

            let intensidade = 0.2; 
            if (qtdFocos > 0) {
                // Aumenta o peso térmico do ponto baseado no número de focos encontrados
                intensidade = Math.min(0.2 + (qtdFocos * 0.2), 1.0);
            }

            return [latitude, longitude, intensidade];
        });

        renderizarCalor(dadosCalor);

    } catch (error) {
        console.error("Erro de conexão com o Back-end. O serviço pode estar offline/dormindo:", error);
        renderizarCalor(obterDadosSimulados());
    }
}

// 4. RENDERIZAÇÃO DA CAMADA DE CALOR (LEAFLET.HEAT)
function renderizarCalor(pontos) {
    if (!map || !L.heatLayer) {
        console.error("Leaflet.heat não encontrado. Certifique-se de carregar o script no HTML.");
        return;
    }

    // Remove a camada térmica anterior para não sobrepor gráficos na atualização
    if (camadaCalor) {
        map.removeLayer(camadaCalor);
    }

    // Aplica as configurações do gradiente do mapa de calor
    camadaCalor = L.heatLayer(pontos, {
        radius: 25,        // Raio do alcance de cada foco
        blur: 15,          // Suavidade da borda
        maxZoom: 18,
        gradient: {
            0.2: 'blue',    // Zona controlada
            0.5: 'yellow',  // Zona de alerta leve
            0.8: 'orange',  // Zona preocupante
            1.0: 'red'      // Zona crítica
        }
    }).addTo(map);
}

// 5. DADOS MOCKADOS (FALLBACK DE SEGURANÇA)
// Impede que o mapa quebre ou fique vazio caso o banco de dados falhe
function obterDadosSimulados() {
    return [
        [-20.2581, -42.0353, 0.2], 
        [-20.2600, -42.0320, 0.5], 
        [-20.2550, -42.0390, 1.0], 
        [-20.2620, -42.0360, 0.8]  
    ];
}

// Inicializa a aplicação assim que a estrutura do site (DOM) carregar
document.addEventListener("DOMContentLoaded", () => {
    inicializarMapa();
});

// Faz o *Polling*: Atualiza os dados no mapa do secretário a cada 30 segundos
setInterval(carregarMapaDeCalor, 30000);