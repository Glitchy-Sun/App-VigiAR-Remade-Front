const USER_KEY = "vigiar.user";
import { CONFIG } from './config.js';
// Função para fazer login
async function login(matricula, password) {
    try {
        const response = await fetch('SUA_API_URL/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, password })
        });

        if (!response.ok) throw new Error("Falha no login");

        const data = await response.json();
        // Salva o usuário no navegador
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        window.location.href = 'index.html'; // Redireciona
    } catch (error) {
        alert(error.message);
    }
}

// Verifica se está logado
function checkAuth() {
    const user = localStorage.getItem(USER_KEY);
    if (!user && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }
}