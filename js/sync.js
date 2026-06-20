import { db } from './db.js';
import { CONFIG } from './config.js'; // Importação do config para usar a URL base

export async function syncData() {
    const pendentes = await db.list(); // Adicionado o 'await' por segurança
    if (pendentes.length === 0) return;

    if (navigator.onLine) {
        try {
            // Aponta para a rota exata e adiciona o Content-Type obrigatório
            const response = await fetch(`${CONFIG.API_URL}/sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(pendentes)
            });
            
            if (response.ok) {
                await db.clear(); // Limpa a fila após sucesso
                console.log("Dados de visitas sincronizados com a nuvem!");
            } else {
                console.error("Servidor recusou a sincronização. Status:", response.status);
            }
        } catch (e) {
            console.error("Falha ao conectar com a API para sincronizar", e);
        }
    }
}