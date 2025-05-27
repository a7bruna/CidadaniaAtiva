
function carregarChamados() {
    const dbChamados = JSON.parse(localStorage.getItem('db_chamados')) || { chamados: [] };
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; 

    dbChamados.chamados.forEach(chamado => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${chamado.id}</td>
            <td>${chamado.tproblema}</td>
            <td>${chamado.motivoabertura}</td>
            <td>${chamado.solicitante}</td>
            <td>ABERTO</td>
            <td>Agente Responsável</td>
            <td>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</td>
            <td>Média</td>
            <td>—</td>
            <td class="acao">
                <button onclick="abrirChamado('${chamado.id}')">📄</button>
                <button onclick="editarChamado('${chamado.id}')">📝</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


document.getElementById('filtro').addEventListener('submit', function (e) {
    e.preventDefault();

    const codigo = document.getElementById('codigo').value.trim().toLowerCase();
    const servico = document.getElementById('servicos').value.trim().toLowerCase();
    const status = document.getElementById('status').value.trim().toLowerCase();
    const dataInicio = document.getElementById('periodo_inicio').value;
    const dataFim = document.getElementById('periodo_fim').value;

    const linhas = document.querySelectorAll('tbody tr');

    linhas.forEach(linha => {
        const colunaCodigo = linha.children[0].textContent.trim().toLowerCase();
        const colunaServico = linha.children[1].textContent.trim().toLowerCase();
        const colunaStatus = linha.children[4].textContent.trim().toLowerCase();
        const colunaData = linha.children[6].textContent.trim().substring(0, 10);

        let mostrar = true;

        if (codigo && !colunaCodigo.includes(codigo)) {
            mostrar = false;
        }

        if (servico && !colunaServico.includes(servico)) {
            mostrar = false;
        }

        if (status && !colunaStatus.includes(status)) {
            mostrar = false;
        }

        if (dataInicio && colunaData < dataInicio) {
            mostrar = false;
        }

        if (dataFim && colunaData > dataFim) {
            mostrar = false;
        }

        linha.style.display = mostrar ? '' : 'none';
    });
});


function abrirChamado(id) {
    alert('Visualizar chamado ID: ' + id);
    
}

function editarChamado(id) {
    alert('Editar chamado ID: ' + id);
    
}

document.addEventListener('DOMContentLoaded', carregarChamados);
