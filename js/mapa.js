// js/mapa.js - Gerenciamento do Mapa de Calor (Heatmap) do EcoVetor

const CONFIG_MAPA = {
    API_URL: "https://app-ads-back-end-wrlc.onrender.com"
};

let map;
let camadaCalor;

// Inicializa a estrutura básica do mapa
function inicializarMapa(idElemento = 'map', lat = -20.2581, lng = -42.0353, zoom = 14) {
    const mapaElemento = document.getElementById(idElemento);
    if (!mapaElemento) return;

    map = L.map(idElemento).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Carrega os focos térmicos imediatamente
    carregarMapaDeCalor();
}

// Consome os dados de latitude e longitude do servidor back-end
async function carregarMapaDeCalor() {
    if (!map) return;

    try {
        const response = await fetch(`${CONFIG_MAPA.API_URL}/api/focos`);
        
        if (!response.ok) {
            console.warn("API indisponível. Gerando dados simulados de contingência.");
            renderizarCalor(obterDadosSimulados());
            return;
        }

        const focos = await response.json();
        
        const dadosCalor = focos.map(foco => {
            const latitude = foco.latitude || foco.lat;
            const longitude = foco.longitude || foco.lng;
            const qtdFocos = foco.quantidade_focos || foco.focos || 0;

            let intensidade = 0.2; 
            if (qtdFocos > 0) {
                intensidade = Math.min(0.2 + (qtdFocos * 0.2), 1.0);
            }

            return [latitude, longitude, intensidade];
        });

        renderizarCalor(dadosCalor);

    } catch (error) {
        console.error("Erro ao conectar com a API:", error);
        renderizarCalor(obterDadosSimulados());
    }
}

// Plota a camada térmica (leaflet-heat) por cima do mapa base
function renderizarCalor(pontos) {
    if (!map || !L.heatLayer) {
        console.error("Plugin Leaflet.heat ausente. Verifique a importação no cabeçalho.");
        return;
    }

    if (camadaCalor) {
        map.removeLayer(camadaCalor);
    }

    camadaCalor = L.heatLayer(pontos, {
        radius: 25,        
        blur: 15,          
        maxZoom: 18,
        gradient: {
            0.2: 'blue',    
            0.5: 'yellow',  
            0.8: 'orange',  
            1.0: 'red'      
        }
    }).addTo(map);
}

// Fallback preventivo caso o Render esteja em modo de repouso ou offline
function obterDadosSimulados() {
    return [
        [-20.2581, -42.0353, 0.2], 
        [-20.2600, -42.0320, 0.5], 
        [-20.2550, -42.0390, 1.0], 
        [-20.2620, -42.0360, 0.8]  
    ];
}

// Dispara o mapa assim que a árvore DOM estiver pronta
document.addEventListener("DOMContentLoaded", () => {
    inicializarMapa();
});

// Polling ativo: Atualiza o mapa automaticamente a cada 30 segundos
setInterval(carregarMapaDeCalor, 30000);