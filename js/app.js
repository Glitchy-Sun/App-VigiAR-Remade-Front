// app.js
import { syncData } from './sync.js';
import { network } from './network.js';

// Executar assim que o documento HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Verificação de Autenticação
    // Se não houver utilizador logado, manda para o login (exceto se já estiver na página de login)
    const user = localStorage.getItem('ecovetor.user');
    if (!user && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Sincronização Automática
    // Tenta sincronizar sempre que o utilizador entrar na página
    if (network.isOnline()) {
        syncData();
    }

    // 3. Listener de Conexão (Offline/Online)
    // Se a internet cair ou voltar, atualizamos o estado
    network.onReconnect(() => {
        console.log("Internet detectada. A sincronizar dados...");
        syncData();
        atualizarInterfaceRede(true);
    });

    window.addEventListener('offline', () => {
        console.log("Você está offline.");
        atualizarInterfaceRede(false);
    });

    // 4. Feedback Visual (Opcional: atualiza um elemento na tela)
    atualizarInterfaceRede(network.isOnline());
});

function atualizarInterfaceRede(isOnline) {
    const statusBar = document.getElementById('status-bar');
    if (statusBar) {
        statusBar.textContent = isOnline ? "ONLINE" : "OFFLINE";
        statusBar.style.backgroundColor = isOnline ? "#16A34A" : "#DC2626";
    }
}