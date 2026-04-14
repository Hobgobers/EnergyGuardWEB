// EnergyGuard - Script Final (com seleção por linha e botões centrais)

const API_URL = "/EnergyGuard_FINAL/api/dispositivos";
const API_AUTH_URL = "/EnergyGuard_FINAL/api/auth";
const API_SUGESTOES_URL = "/EnergyGuard_FINAL/api/sugestoes";
const PRECO_KWH = 0.80;

// --- UTILITÁRIOS ---
function mostrarMensagem(id, texto, tipo = 'erro') {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = texto;
        el.className = `msg msg-${tipo}`;
        setTimeout(() => { if (el.textContent === texto) el.textContent = ''; }, 4000);
    }
}

// --- AUTENTICAÇÃO (manter seu código original) ---
async function realizarCadastro(event) {
    event.preventDefault();
    const usuario = document.getElementById('cad-usuario').value.trim();
    const senha = document.getElementById('cad-senha').value;
    if (usuario.length < 3 || senha.length < 4) {
        mostrarMensagem('msg-cadastro', 'Usuário (min 3) e Senha (min 4) inválidos.', 'erro');
        return;
    }
    try {
        const res = await fetch(`${API_AUTH_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });
        if (!res.ok) throw new Error();
        const result = await res.json();
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
    const usuario = document.getElementById('log-usuario').value.trim();
    const senha = document.getElementById('log-senha').value;
    try {
        const res = await fetch(`${API_AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });
        if (!res.ok) throw new Error();
        const result = await res.json();
        if (result.sucesso) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('usuarioNome', result.usuario);
            mostrarMensagem('msg-login', 'Login realizado!', 'sucesso');
            setTimeout(() => window.location.href = 'menu_principal.html', 1000);
        } else {
            mostrarMensagem('msg-login', result.mensagem, 'erro');
        }
    } catch {
        mostrarMensagem('msg-login', 'Erro ao conectar com o servidor.', 'erro');
    }
}

function verificarLogin() {
    const paginaAtual = window.location.pathname.split('/').pop();
    const paginasPublicas = ['index.html', 'login_usuario.html', 'cadastro_usuario.html'];
    if (!sessionStorage.getItem('isLoggedIn') && !paginasPublicas.includes(paginaAtual)) {
        alert("Você precisa estar logado.");
        window.location.href = 'index.html';
    }
}
function logout() { sessionStorage.clear(); window.location.href = 'index.html'; }
function sairSistema() { logout(); }

// ========== CONTROLE DE DISPOSITIVOS (sem botões na tabela) ==========
let dispositivoSelecionadoId = null;

function carregarTabelaControle() {
    const tbody = document.querySelector('#tabela-controle tbody');
    if (!tbody) return;
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3">Nenhum dispositivo.</td></tr>';
                return;
            }
            data.forEach(d => {
                const tr = document.createElement('tr');
                tr.dataset.id = d.id;
                tr.innerHTML = `
                    <td>${d.nome}</td>
                    <td>${d.potencia} W</td>
                    <td>${d.ligado ? 'LIGADO' : 'DESLIGADO'}</td>
                `;
                tr.addEventListener('click', () => selecionarLinhaControle(tr, d.id));
                tbody.appendChild(tr);
            });
        })
        .catch(() => tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar.</td></tr>');
}

function selecionarLinhaControle(tr, id) {
    // Remove destaque de todas as linhas
    document.querySelectorAll('#tabela-controle tbody tr').forEach(row => row.classList.remove('selected'));
    tr.classList.add('selected');
    dispositivoSelecionadoId = id;
}

function toggleDispositivoSelecionado() {
    if (dispositivoSelecionadoId === null) {
        alert("Selecione um dispositivo clicando na linha.");
        return;
    }
    // Precisamos saber o status atual para inverter. Vamos buscar da linha selecionada.
    const linha = document.querySelector('#tabela-controle tbody tr.selected');
    if (!linha) return;
    const statusCell = linha.cells[2]; // terceira coluna (status)
    const statusTexto = statusCell.innerText.trim();
    const novoStatus = statusTexto === 'DESLIGADO';
    alternarStatus(dispositivoSelecionadoId, novoStatus);
}

function alternarStatus(id, novoStatus) {
    fetch(`${API_URL}/${id}/status?status=${novoStatus}`, { method: 'PUT' })
        .then(res => res.json())
        .then(() => carregarTabelaControle()) // recarrega a tabela
        .catch(() => alert('Erro ao alterar status.'));
}

// ========== EXCLUIR DISPOSITIVOS ==========
let dispositivoParaExclusaoId = null;

function carregarTabelaDeletar() {
    const tbody = document.querySelector('#tabela-deletar tbody');
    if (!tbody) return;
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            data.forEach(d => {
                const tr = document.createElement('tr');
                tr.dataset.id = d.id;
                tr.innerHTML = `
                    <td>${d.nome}</td>
                    <td>${d.potencia} W</td>
                    <td>${d.ligado ? 'LIGADO' : 'DESLIGADO'}</td>
                `;
                tr.addEventListener('click', () => selecionarLinhaDeletar(tr, d.id));
                tbody.appendChild(tr);
            });
        })
        .catch(() => tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar.</td></tr>');
}

function selecionarLinhaDeletar(tr, id) {
    document.querySelectorAll('#tabela-deletar tbody tr').forEach(row => row.classList.remove('selected'));
    tr.classList.add('selected');
    dispositivoParaExclusaoId = id;
}

function deletarDispositivoSelecionado() {
    if (!dispositivoParaExclusaoId) {
        alert("Selecione um dispositivo clicando na linha.");
        return;
    }
    fetch(`${API_URL}/${dispositivoParaExclusaoId}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            dispositivoParaExclusaoId = null;
            carregarTabelaDeletar();
            alert("Dispositivo excluído com sucesso!");
        })
        .catch(() => alert("Erro ao excluir."));
}

// ========== CADASTRO DISPOSITIVO ==========
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
    .then(res => res.json())
    .then(() => mostrarMensagem('msg-disp', 'Salvo!', 'sucesso'))
    .catch(() => mostrarMensagem('msg-disp', 'Erro.', 'erro'));
}

// ========== CONSUMO TOTAL ==========
function calcularConsumoTotal() {
    const el = document.getElementById('valor-total');
    if (!el) return;
    fetch(`${API_URL}/consumo`)
        .then(res => res.json())
        .then(d => el.textContent = `${d.total.toFixed(1)} W`)
        .catch(() => el.textContent = 'Erro');
}

// ========== CONVERSOR ==========
function converterRealWatts(event) {
    event.preventDefault();
    const valor = parseFloat(document.getElementById('conv-valor').value);
    if (isNaN(valor) || valor <= 0) return;
    const watts = (valor / PRECO_KWH) * 1000;
    document.getElementById('resultado-conversor').innerHTML = `${watts.toFixed(0)} Watts possíveis`;
}

// ========== CONSUMO IDEAL ==========
function reaisParaWatts(valorReais) {
    return (valorReais / PRECO_KWH) * 1000;
}

async function calcularConsumoIdeal(event) {
    event.preventDefault();
    const metaReais = parseFloat(document.getElementById('meta-valor').value);
    if (isNaN(metaReais) || metaReais <= 0) {
        alert("Digite um valor válido em Reais.");
        return;
    }
    const consumoIdealWatts = reaisParaWatts(metaReais);
    try {
        const resConsumo = await fetch(`${API_URL}/consumo`);
        const consumoAtual = (await resConsumo.json()).total;
        const resSug = await fetch(`${API_SUGESTOES_URL}/analisar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ consumoIdeal: consumoIdealWatts })
        });
        const sugestoes = await resSug.json();
        const div = document.getElementById('res-ideal');
        if (sugestoes.precisaReduzir) {
            const lista = sugestoes.sugestoes.map(d => `${d.nome} (${d.potencia}W)`).join(', ');
            div.innerHTML = `Consumo atual: ${consumoAtual} W<br>Meta: ${consumoIdealWatts.toFixed(0)} W<br>Desligue: ${lista || "nenhum dispositivo sugerido"}`;
        } else {
            div.innerHTML = `Consumo atual: ${consumoAtual} W<br>Meta: ${consumoIdealWatts.toFixed(0)} W<br>✅ Já está dentro da meta!`;
        }
    } catch {
        document.getElementById('res-ideal').innerHTML = "Erro ao calcular. Verifique o servidor.";
    }
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    verificarLogin();

    if (document.querySelector('#tabela-controle')) carregarTabelaControle();
    if (document.querySelector('#tabela-deletar')) carregarTabelaDeletar();
    if (document.getElementById('valor-total')) calcularConsumoTotal();

    document.getElementById('form-dispositivo')?.addEventListener('submit', salvarDispositivo);
    document.getElementById('form-cadastro')?.addEventListener('submit', realizarCadastro);
    document.getElementById('form-login')?.addEventListener('submit', realizarLogin);
    document.getElementById('form-conversor')?.addEventListener('submit', converterRealWatts);
    document.getElementById('form-ideal')?.addEventListener('submit', calcularConsumoIdeal);

    // Botões centrais
    const btnToggle = document.getElementById('btn-toggle');
    if (btnToggle) btnToggle.addEventListener('click', toggleDispositivoSelecionado);
    const btnDeletar = document.getElementById('btn-deletar');
    if (btnDeletar) btnDeletar.addEventListener('click', deletarDispositivoSelecionado);
});