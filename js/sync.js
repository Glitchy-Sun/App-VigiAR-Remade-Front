import { db } from './db.js';

export async function syncData() {
    const pendentes = db.list();
    if (pendentes.length === 0) return;

    if (navigator.onLine) {
        try {
            // Aqui vai o seu fetch para a API (o backend que você já tem)
            const response = await fetch('http://127.0.0.1:3000/sync', {
                method: 'POST',
                body: JSON.stringify(pendentes)
            });
            
            if (response.ok) {
                db.clear(); // Limpa a fila após sucesso
                console.log("Dados sincronizados!");
            }
        } catch (e) {
            console.error("Falha ao sincronizar", e);
        }
    }
}