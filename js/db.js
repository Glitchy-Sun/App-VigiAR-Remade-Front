// db.js
const QUEUE_KEY = "ecovetor.pending.visitas";

/**
 * Módulo para gerenciar a fila de visitas offline.
 * Mantém a mesma interface do localdb.ts original.
 */
export const localDB = {
    
    // Lista todas as visitas pendentes
    async list() {
        const raw = localStorage.getItem(QUEUE_KEY);
        try {
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Erro ao ler fila local:", e);
            return [];
        }
    },

    // Retorna a quantidade de registros pendentes
    async count() {
        const queue = await this.list();
        return queue.length;
    },

    // Adiciona uma visita na fila
    // Espera um objeto 'visita' completo (conforme a interface PendingVisita)
    async enqueue(visita) {
        const queue = await this.list();
        
        // Garante que o objeto tenha o timestamp de registro se não tiver
        const novaVisita = {
            ...visita,
            registrado_em: visita.registrado_em || new Date().toISOString()
        };

        queue.push(novaVisita);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    },

    // Remove apenas as visitas que o servidor confirmou o recebimento
    // Essencial para não deletar o que ainda não foi enviado
    async removeByClientIds(ids) {
        let queue = await this.list();
        // Filtra mantendo apenas o que NÃO está na lista de ids confirmados
        queue = queue.filter(item => !ids.includes(item.client_id));
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    },

    // Limpa tudo (usar com cuidado)
    async clear() {
        localStorage.removeItem(QUEUE_KEY);
    }
};