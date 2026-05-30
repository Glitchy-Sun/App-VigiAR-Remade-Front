// Inicializa o mapa
const map = L.map('map').setView([-8.0584, -34.8848], 13); // Coordenadas exemplo

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Função para adicionar pontos (substitui a lógica de geojson do seu arquivo antigo)
function carregarPontos(features) {
    features.forEach(f => {
        const [lng, lat] = f.geometry.coordinates;
        L.circleMarker([lat, lng], { radius: 7, color: 'red' }).addTo(map)
         .bindPopup("Ponto de Foco");
    });
}