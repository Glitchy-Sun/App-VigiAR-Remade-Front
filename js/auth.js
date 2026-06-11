import { CONFIG } from './config.js';

const USER_KEY = "ecovetor.user";

export async function login(matricula, password, tipo) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matricula, password, tipo })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Erro ao fazer login. Verifique os dados.");
        }

        const data = await response.json();
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        
        // Redirecionamento dinâmico baseado no perfil retornado pelo MongoDB
        if (data.user.tipo === "secretario") {
            window.location.href = 'secretario.html';
        } else {
            window.location.href = 'index.html';
        }
    } catch (error) {
        alert(error.message);
    }
}

export async function register(dados) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Erro ao realizar o cadastro.");
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = 'login.html';
    } catch (error) {
        alert(error.message);
    }
}

export function checkAuth(tipoRequerido) {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) {
        window.location.href = 'login.html';
        return null;
    }
    const user = JSON.parse(userStr);
    if (tipoRequerido && user.tipo !== tipoRequerido) {
        alert("Acesso negado para o seu perfil.");
        window.location.href = user.tipo === 'secretario' ? 'secretario.html' : 'index.html';
        return null;
    }
    return user;
}