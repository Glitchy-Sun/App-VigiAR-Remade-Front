const QUEUE_KEY = "vigiar.pending.visitas";

export const db = {
    // Adiciona uma visita na fila
    enqueue: (visita) => {
        const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
        queue.push({ ...visita, client_id: Date.now().toString() }); // ID simples
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    },
    // Lê a fila
    list: () => JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"),
    // Limpa após sincronizar
    clear: () => localStorage.removeItem(QUEUE_KEY)
};