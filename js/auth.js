import { CONFIG } from './config.js';

const USER_KEY = "vigiar.user";

// Função para fazer login
export async function login(matricula, password) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, password })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro ao fazer login. Verifique sua matrícula e senha.");
        }

        const data = await response.json();
        
        // Salva o usuário no navegador
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        
        // Redireciona para a Home
        window.location.href = 'index.html'; 
    } catch (error) {
        alert(error.message);
    }
}

// Função para registrar novo usuário
export async function register(dados) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro ao realizar cadastro.");
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = 'login.html'; // Volta para o login após cadastrar
    } catch (error) {
        alert(error.message);
    }
}

// Verifica se está logado (pode ser chamada nas páginas protegidas)
export function checkAuth() {
    const user = localStorage.getItem(USER_KEY);
    if (!user && window.location.pathname !== '/login.html' && window.location.pathname !== '/cadastro.html') {
        window.location.href = 'login.html';
    }
}