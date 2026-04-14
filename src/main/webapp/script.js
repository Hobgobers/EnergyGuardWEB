/**
 * EnergyGuard - Script Completo (Spring + MySQL)
 * Integração Front-end com Back-end REST
 */

// --- CONFIGURAÇÃO DE URLs ---
// --- CONFIGURAÇÃO DE URLs CORRIGIDA ---
// --- CONFIGURAÇÃO DE URLs CORRIGIDA ---
const API_URL = "/EnergyGuard_FINAL/api/dispositivos";
const API_AUTH_URL = "/EnergyGuard_FINAL/api/auth";
const API_SUGESTOES_URL = "/EnergyGuard_FINAL/api/sugestoes";

// --- UTILITÁRIOS ---
const mostrarMensagem = (id, texto, tipo = 'erro') => {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = texto;
        el.className = `msg msg-${tipo}`;
        setTimeout(() => {
            if (el.textContent === texto) el.textContent = '';
        }, 4000);
    }
};

// --- AUTENTICAÇÃO ---

async function realizarCadastro(event) {
    event.preventDefault();

    const usuarioInput = document.getElementById('cad-usuario');
    const senhaInput = document.getElementById('cad-senha');

    if (!usuarioInput || !senhaInput) return;

    const dados = {
        usuario: usuarioInput.value.trim(),
        senha: senhaInput.value
    };

    if (dados.usuario.length < 3 || dados.senha.length < 4) {
        mostrarMensagem('msg-cadastro', 'Usuário (min 3) e Senha (min 4) inválidos.', 'erro');
        return;
    }

    try {
        const response = await fetch(`${API_AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error();

        const result = await response.json();

        if (result.sucesso) {
            mostrarMensagem('msg-cadastro', result.mensagem, 'sucesso');
            setTimeout(() => window.location.href = 'login_usuario.html', 1500);
        } else {
            mostrarMensagem('msg-cadastro', result.mensagem, 'erro');
        }
    } catch {
        mostrarMensagem('msg-cadastro', 'Erro ao conectar com o servidor.', 'erro');
    }
}

async function realizarLogin(event) {
    event.preventDefault();

    const usuarioInput = document.getElementById('log-usuario');
    const senhaInput = document.getElementById('log-senha');

    if (!usuarioInput || !senhaInput) return;

    const dados = {
        usuario: usuarioInput.value.trim(),
        senha: senhaInput.value
    };

    try {
        const response = await fetch(`${API_AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error();

        const result = await response.json();

        if (result.sucesso) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('usuarioNome', result.usuario);

            mostrarMensagem('msg-login', 'Login realizado!', 'sucesso');

            setTimeout(() => {
                window.location.href = 'menu_principal.html';
            }, 1000);
        } else {
            mostrarMensagem('msg-login', result.mensagem, 'erro');
        }
    } catch {
        mostrarMensagem('msg-login', 'Erro ao conectar com o servidor.', 'erro');
    }
}

// --- SEGURANÇA ---
function verificarLogin() {
    const paginaAtual = window.location.pathname.split('/').pop();
    const paginasPublicas = ['index.html', 'login_usuario.html', 'cadastro_usuario.html'];

    if (!sessionStorage.getItem('isLoggedIn') && !paginasPublicas.includes(paginaAtual)) {
        // alert removido
        window.location.href = 'index.html';
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function sairSistema() {
    logout();
}

// --- DISPOSITIVOS ---

function carregarTabelaControle() {
    const tbody = document.querySelector('#tabela-controle tbody');
    if (!tbody) return;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(data => {
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Nenhum dispositivo.</td></tr>';
                return;
            }

            data.forEach(d => {
                const status = d.ligado ? 'LIGADO' : 'DESLIGADO';
                const btnText = d.ligado ? 'Desligar' : 'Ligar';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${d.id}</td>
                    <td>${d.nome}</td>
                    <td>${d.potencia} W</td>
                    <td>${status}</td>
                    <td>
                        <button onclick="alternarStatus(${d.id}, ${!d.ligado})">
                            ${btnText}
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(() => {
            tbody.innerHTML = '<tr><td colspan="5">Erro ao carregar.</td></tr>';
        });
}

function alternarStatus(id, status) {
    fetch(`${API_URL}/${id}/status?status=${status}`, { method: 'PUT' })
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(() => carregarTabelaControle())
        .catch(() => alert('Erro ao alterar status.'));
}

// --- DELETE ---

let dispositivoParaExclusaoId = null;

function carregarTabelaDeletar() {
    const tbody = document.querySelector('#tabela-deletar tbody');
    if (!tbody) return;

    fetch(API_URL)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(data => {
            tbody.innerHTML = '';

            data.forEach(d => {
                const tr = document.createElement('tr');
                tr.dataset.id = d.id;

                tr.innerHTML = `
                    <td>${d.id}</td>
                    <td>${d.nome}</td>
                    <td>${d.potencia}</td>
                    <td>${d.ligado ? 'LIGADO' : 'DESLIGADO'}</td>
                    <td>
                        <button onclick="selecionarParaExclusao(${d.id})">
                            Excluir
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
}

function selecionarParaExclusao(id) {
    dispositivoParaExclusaoId = id;
}

function deletarDispositivoSelecionado() {
    if (!dispositivoParaExclusaoId) {
        alert("Selecione um dispositivo.");
        return;
    }

    fetch(`${API_URL}/${dispositivoParaExclusaoId}`, { method: 'DELETE' })
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(() => {
            dispositivoParaExclusaoId = null;
            carregarTabelaDeletar();
        })
        .catch(() => alert('Erro ao excluir.'));
}

// --- CADASTRO DISPOSITIVO ---

function salvarDispositivo(event) {
    event.preventDefault();

    const nome = document.getElementById('disp-nome').value.trim();
    const potencia = parseFloat(document.getElementById('disp-consumo').value);

    if (!nome || potencia <= 0) {
        mostrarMensagem('msg-disp', 'Dados inválidos.', 'erro');
        return;
    }

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, potencia, ligado: false })
    })
    .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
    })
    .then(() => mostrarMensagem('msg-disp', 'Salvo!', 'sucesso'))
    .catch(() => mostrarMensagem('msg-disp', 'Erro.', 'erro'));
}

// --- CONSUMO ---

function calcularConsumoTotal() {
    const el = document.getElementById('valor-total');
    if (!el) return;

    fetch(`${API_URL}/consumo`)
        .then(r => {
            if (!r.ok) throw new Error();
            return r.json();
        })
        .then(d => el.textContent = `${d.total.toFixed(1)} W`)
        .catch(() => el.textContent = 'Erro');
}

// --- CONVERSOR ---

function converterRealWatts(event) {
    event.preventDefault();

    const valor = parseFloat(document.getElementById('conv-valor').value);

    if (isNaN(valor) || valor <= 0) return;

    const preco = 0.80;
    const watts = (valor / preco) * 1000;

    document.getElementById('resultado-conversor').innerHTML =
        `${watts.toFixed(0)} Watts possíveis`;
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {

    verificarLogin();

    if (document.querySelector('#tabela-controle')) carregarTabelaControle();
    if (document.querySelector('#tabela-deletar')) carregarTabelaDeletar();
    if (document.getElementById('valor-total')) calcularConsumoTotal();

    document.getElementById('form-dispositivo')?.addEventListener('submit', salvarDispositivo);
    document.getElementById('form-cadastro')?.addEventListener('submit', realizarCadastro);
    document.getElementById('form-login')?.addEventListener('submit', realizarLogin);
    document.getElementById('form-conversor')?.addEventListener('submit', converterRealWatts);
});